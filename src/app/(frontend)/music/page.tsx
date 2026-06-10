import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { buttonVariants } from '@/components/ui/button'
import { MusicReleaseGridClient } from '@/components/MusicReleaseGridClient'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { cache } from 'react'
import PageClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import type { Release } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { Play } from 'lucide-react'

export const dynamic = 'force-static'
export const revalidate = 600

const projectLabels = {
  teb: 'TEB',
  travis: 'Travis (Solo)',
} as const

type ProjectKey = keyof typeof projectLabels

const resolveProjectLabel = (project?: Release['project'] | null) => {
  if (project && project in projectLabels) {
    return projectLabels[project as ProjectKey]
  }
  return 'Release'
}

const linkPriority = ['Bandcamp', 'Spotify', 'Apple Music']

const sortLinks = (links: Array<{ label: string; url: string }>) => {
  return [...links].sort((a, b) => {
    const aIndex = linkPriority.indexOf(a.label)
    const bIndex = linkPriority.indexOf(b.label)
    const safeA = aIndex === -1 ? linkPriority.length : aIndex
    const safeB = bIndex === -1 ? linkPriority.length : bIndex
    return safeA - safeB
  })
}

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

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  })
  const latestRelease = releases.docs[0] ?? null
  const featuredDateLabel = latestRelease?.releaseDate
    ? formatter.format(new Date(latestRelease.releaseDate))
    : ''
  const featuredLinks = sortLinks(
    latestRelease?.links?.filter((link) => Boolean(link?.url && link?.label)) ?? [],
  )
  const featuredPrimaryLink = featuredLinks[0]
  const featuredSecondaryLinks = featuredLinks.slice(1, 3)
  const featuredTracks = latestRelease?.tracklist?.slice(0, 4) ?? []
  const gridReleases = latestRelease ? releases.docs.slice(1) : releases.docs
  const releaseCards = gridReleases.map((release) => {
    const coverArt =
      release.coverArt && typeof release.coverArt === 'object' ? release.coverArt : null
    const releaseLinks = sortLinks(
      release.links?.filter((link) => Boolean(link?.url && link?.label)) ?? [],
    )
    return {
      id: release.id,
      title: release.title,
      slug: release.slug,
      project: release.project ?? null,
      isLive: release.isLive ?? null,
      bandcampId: release.bandcampId ?? null,
      releaseDateLabel: release.releaseDate ? formatter.format(new Date(release.releaseDate)) : '',
      coverArtUrl: coverArt?.url ? getMediaUrl(coverArt.url, coverArt.updatedAt) : '',
      coverArtAlt: coverArt?.alt || release.title,
      links: releaseLinks,
    }
  })

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/music" />

      {draft && <LivePreviewListener />}
      <StructuredData doc={page} />

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      {/* Page header */}
      <div className="container mt-12">
        {!page?.hero && (
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-label uppercase text-primary">Music archive</p>
            <h1 className="font-display font-extrabold tracking-display text-display-lg md:text-display-xl">
              Discography
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A listening room for studio records, live energy, and the stories behind each release.
            </p>
          </div>
        )}
      </div>

      {/* Featured release */}
      {latestRelease ? (
        <section className="container mt-10">
          <div className="rounded-md border border-border bg-card p-6 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                {/* Eyebrow */}
                <p className="font-mono text-label uppercase text-primary">Listening room</p>

                <h2 className="mt-4 font-display font-extrabold tracking-display text-display-sm md:text-display-md">
                  Latest release
                </h2>

                <p className="mt-3 text-xl font-display">{latestRelease.title}</p>

                {/* Meta badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
                      latestRelease.project === 'travis'
                        ? 'bg-denim-500/15 text-denim-600 dark:text-denim-300'
                        : 'bg-clay-500/15 text-clay-600 dark:text-clay-300',
                    )}
                  >
                    {resolveProjectLabel(latestRelease.project)}
                  </span>
                  {featuredDateLabel && (
                    <span className="font-mono text-label-sm uppercase text-muted-foreground">
                      Released {featuredDateLabel}
                    </span>
                  )}
                  {latestRelease.tracklist?.length ? (
                    <span className="font-mono text-label-sm text-muted-foreground/60">
                      {latestRelease.tracklist.length} tracks
                    </span>
                  ) : null}
                </div>

                {/* Description */}
                <div className="mt-6 max-w-xl text-muted-foreground">
                  {latestRelease.description ? (
                    <RichText
                      data={latestRelease.description}
                      enableGutter={false}
                      enableProse={false}
                    />
                  ) : (
                    <p>
                      A new chapter in the Travis Ehrenstrom catalog, recorded with the band and
                      built for late-night drives and front-porch singalongs.
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    className={cn(buttonVariants({ size: 'lg', variant: 'default' }), 'gap-2')}
                    href={`/music/${latestRelease.slug}#player`}
                  >
                    <Play className="h-4 w-4" />
                    Play
                  </Link>
                  {featuredPrimaryLink && (
                    <a
                      className={buttonVariants({ size: 'lg', variant: 'outline' })}
                      href={featuredPrimaryLink.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {featuredPrimaryLink.label}
                    </a>
                  )}
                  <Link
                    className={buttonVariants({ size: 'lg', variant: 'outline' })}
                    href={`/music/${latestRelease.slug}`}
                  >
                    Full release
                  </Link>
                  {featuredSecondaryLinks.map((link) => (
                    <a
                      className={buttonVariants({ size: 'sm', variant: 'outline' })}
                      href={link.url}
                      key={link.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Album art */}
              <div>
                <div>
                  <div className="relative overflow-hidden rounded-md border border-border">
                    {latestRelease.coverArt && typeof latestRelease.coverArt !== 'string' ? (
                      <div className="relative aspect-square w-full">
                        <Media fill imgClassName="object-cover" resource={latestRelease.coverArt} />
                      </div>
                    ) : (
                      <div className="flex aspect-square w-full items-center justify-center bg-secondary">
                        <div className="text-center">
                          <p className="font-mono text-label uppercase text-muted-foreground">
                            Latest release
                          </p>
                          <p className="mt-2 font-display text-lg">{latestRelease.title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="mt-4 flex items-center justify-center gap-3 font-mono text-label-sm uppercase text-muted-foreground">
                    <span>Now streaming</span>
                    <span aria-hidden="true" className="opacity-50">
                      ·
                    </span>
                    <span>Download available</span>
                  </div>
                </div>

                {/* Track highlights */}
                {featuredTracks.length > 0 && (
                  <div className="mt-6 rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between font-mono text-label-sm uppercase text-muted-foreground">
                      <span>Track highlights</span>
                      <span>{featuredTracks.length} picks</span>
                    </div>
                    <ol className="mt-4 space-y-3">
                      {featuredTracks.map((track, index) => (
                        <li
                          className="flex items-center justify-between gap-4 text-sm"
                          key={track.id ?? index}
                        >
                          <span className="font-mono text-muted-foreground">
                            {String(index + 1).padStart(2, '0')}.
                          </span>
                          <span className="flex-1">{track.title}</span>
                          {track.duration && (
                            <span className="font-mono text-label-sm text-muted-foreground/60">
                              {track.duration}
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="container mt-10">
          <div className="rounded-md border border-border bg-card p-10 text-center">
            <p className="font-mono text-label uppercase text-primary">Listening room</p>
            <h2 className="mt-4 font-display font-extrabold tracking-display text-display-sm">
              Releases coming soon
            </h2>
            <p className="mt-3 text-muted-foreground">
              Stay tuned for new recordings, live sessions, and the full discography.
            </p>
          </div>
        </section>
      )}

      {/* Discography grid */}
      <section className="container mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="mb-3 font-mono text-label uppercase text-primary">Discography</p>
            <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
              Release index
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Tap a record for full details, credits, and links.
          </p>
        </div>

        <MusicReleaseGridClient releases={releaseCards} />
      </section>
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
