import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import { buttonVariants } from '@/components/ui/button'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import PageClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import { cn } from '@/utilities/ui'
import { VinylTurntable } from '@/components/VinylTurntable'
import type { Media } from '@/payload-types'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const releases = await payload.find({
    collection: 'releases',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return releases.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ReleasePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/music/' + decodedSlug
  const release = await queryReleaseBySlug({ draft, slug: decodedSlug })

  if (!release) return <PayloadRedirects url={url} />

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  })
  const dateLabel = release.releaseDate ? formatter.format(new Date(release.releaseDate)) : ''
  const bandcampEmbedUrl = release.bandcampId
    ? `https://bandcamp.com/EmbeddedPlayer/album=${release.bandcampId}/size=large/bgcol=111111/linkcol=faf5ed/tracklist=true/transparent=true/`
    : ''

  // Get cover art as Media object
  const coverArt =
    release.coverArt && typeof release.coverArt !== 'string' ? release.coverArt : null

  // Prepare tracklist for the turntable
  const tracklist =
    release.tracklist?.map((track) => ({
      title: track.title,
      duration: track.duration,
      id: track.id,
    })) || []

  return (
    <article className="pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <StructuredData doc={release} type="MusicAlbum" />

      {/* Hero Section with Vinyl Turntable */}
      <section className="release-hero container">
        {coverArt && bandcampEmbedUrl ? (
          <VinylTurntable
            coverArt={coverArt}
            title={release.title}
            bandcampEmbedUrl={bandcampEmbedUrl}
            tracklist={tracklist}
          />
        ) : coverArt ? (
          // Fallback: Just show the album art if no Bandcamp
          <div className="max-w-md mx-auto">
            <img
              src={coverArt.url || ''}
              alt={coverArt.alt || release.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        ) : null}

        {/* Album metadata */}
        <div className="mt-10 text-center">
          <h1 className="font-display text-display-lg">{release.title}</h1>
          {dateLabel && (
            <p className="mt-2 text-label uppercase tracking-stamp text-muted-foreground">
              Released {dateLabel}
            </p>
          )}
        </div>

        {/* Streaming links */}
        <div className="streaming-links mt-8">
          {release.links
            ?.filter((link) => Boolean(link?.url && link?.label))
            .map((link, index) => (
              <a
                href={link?.url as string}
                key={`${release.id}-link-${index}`}
                rel="noreferrer"
                target="_blank"
              >
                {link?.label}
              </a>
            ))}
        </div>
      </section>

      {/* Description */}
      {release.description && (
        <section className="container mt-16 max-w-2xl mx-auto">
          <div className="prose dark:prose-invert max-w-none">
            <RichText data={release.description} />
          </div>
        </section>
      )}

      {/* Decorative divider */}
      <div className="container mt-16 flex justify-center">
        <span className="ornament-star-soft" />
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const release = await queryReleaseBySlug({ draft: false, slug: decodedSlug })

  return generateMeta({ doc: release })
}

const queryReleaseBySlug = cache(async ({ draft, slug }: { draft: boolean; slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'releases',
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
})
