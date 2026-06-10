import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { MusicPageClient } from '@/components/MusicPageClient'
import type { PopularTrack, ReleaseCard } from '@/components/MusicPageClient'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import PageClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import type { Release } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const dynamic = 'force-static'
export const revalidate = 600

const getCover = (release: Release) =>
  release.coverArt && typeof release.coverArt === 'object' ? release.coverArt : null

const getCoverUrl = (release: Release) => {
  const cover = getCover(release)
  return cover?.url ? getMediaUrl(cover.url, cover.updatedAt) : ''
}

const getYear = (release: Release) =>
  release.releaseDate ? String(new Date(release.releaseDate).getFullYear()) : ''

export default async function MusicPage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const page = await queryPageBySlug({ draft, slug: 'music' })

  const releases = await payload.find({
    collection: 'releases',
    depth: 1,
    draft,
    limit: 200,
    overrideAccess: draft,
    sort: '-releaseDate',
  })

  const releasesWithBandcamp = releases.docs.filter((release) => Boolean(release.bandcampId))

  // "Popular tracks" — editor-curated via the `featured` checkbox on tracklist rows.
  let popularTracks: PopularTrack[] = []
  for (const release of releasesWithBandcamp) {
    const coverUrl = getCoverUrl(release)
    release.tracklist?.forEach((track, index) => {
      if (!track.featured) return
      const trackNum = track.bandcampTrackNum ?? index + 1
      popularTracks.push({
        id: `${release.id}-${trackNum}`,
        releaseId: String(release.id),
        trackTitle: track.title,
        releaseTitle: release.title,
        duration: track.duration,
        coverUrl,
        bandcampId: release.bandcampId as string,
        trackNum,
      })
    })
  }
  popularTracks = popularTracks.slice(0, 8)

  // Fallback when nothing is flagged: opening track of the newest releases.
  if (popularTracks.length === 0) {
    popularTracks = releasesWithBandcamp
      .filter((release) => release.tracklist && release.tracklist.length > 0)
      .slice(0, 6)
      .map((release) => {
        const firstTrack = release.tracklist![0]
        return {
          id: `${release.id}-1`,
          releaseId: String(release.id),
          trackTitle: firstTrack.title,
          releaseTitle: release.title,
          duration: firstTrack.duration,
          coverUrl: getCoverUrl(release),
          bandcampId: release.bandcampId as string,
          trackNum: 1,
        }
      })
  }

  const releaseCards: ReleaseCard[] = releases.docs.map((release) => ({
    id: String(release.id),
    title: release.title,
    slug: release.slug ?? '',
    project: release.project ?? null,
    isLive: release.isLive ?? null,
    year: getYear(release),
    coverUrl: getCoverUrl(release),
    coverAlt: getCover(release)?.alt || release.title,
    bandcampId: release.bandcampId ?? null,
  }))

  const hasHero = Boolean(page?.hero?.type && page.hero.type !== 'none')

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/music" />

      {draft && <LivePreviewListener />}
      <StructuredData doc={page} />

      {hasHero && page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      {/* Page header (hero type 'none' means "no hero" — use the built-in head) */}
      {!hasHero && (
        <div className="container mt-12">
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-label uppercase text-primary">2007 — 2025</p>
            <h1 className="font-display font-extrabold tracking-display text-display-lg md:text-display-xl">
              Music
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {
                'Two decades of records — quiet acoustic folk under Travis’s own name, and the funky fusion-rock of TEB. Tap any cover to listen.'
              }
            </p>
          </div>
        </div>
      )}

      <MusicPageClient popularTracks={popularTracks} releases={releaseCards} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: 'music',
      },
    },
  })

  return generateMeta({
    doc: result.docs?.[0] || null,
    fallbackTitle: 'Music',
    fallbackDescription: 'Listen to releases from Travis Ehrenstrom Band (TEB).',
    path: '/music',
  })
}

const queryPageBySlug = cache(
  async ({
    draft,
    slug,
  }: {
    draft: boolean
    slug: string
  }): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
