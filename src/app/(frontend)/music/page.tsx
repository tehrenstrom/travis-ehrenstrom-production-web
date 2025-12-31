import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { buttonVariants } from '@/components/ui/button'
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
  const featuredLinks =
    latestRelease?.links?.filter((link) => Boolean(link?.url && link?.label)) ?? []
  const featuredPrimaryLink = featuredLinks[0]
  const featuredSecondaryLinks = featuredLinks.slice(1, 3)
  const featuredTracks = latestRelease?.tracklist?.slice(0, 4) ?? []
  const gridReleases = latestRelease ? releases.docs.slice(1) : releases.docs

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/music" />

      {draft && <LivePreviewListener />}
      <StructuredData doc={page} />

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      <div className="container mt-12">
        {!page?.hero && (
          <div className="max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-[0.36em] text-foreground/60">
              Music Archive
            </p>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Travis Ehrenstrom Band Music & Discography
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              A listening room for studio records, live energy, and the stories behind each release.
            </p>
          </div>
        )}
      </div>

      {latestRelease ? (
        <section className="container mt-10">
          <div className="relative overflow-hidden rounded-[36px] border border-foreground/10 bg-card/80 p-6 shadow-[0_30px_80px_-60px_rgba(15,15,15,0.55)] backdrop-blur md:p-10">
            <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-6 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-[repeating-linear-gradient(135deg,_hsl(var(--foreground)_/_0.12)_0_12px,_transparent_12px_24px)] opacity-60" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.36em] text-foreground/60">
                  Listening Room
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Latest Release</h2>
                <p className="mt-3 text-xl font-semibold">{latestRelease.title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[0.65rem] font-mono uppercase tracking-[0.28em] text-foreground/60">
                  <span className="rounded-full border border-foreground/20 bg-background/70 px-3 py-1">
                    {resolveProjectLabel(latestRelease.project)}
                  </span>
                  {featuredDateLabel && <span>Released {featuredDateLabel}</span>}
                  {latestRelease.tracklist?.length ? (
                    <span>{latestRelease.tracklist.length} tracks</span>
                  ) : null}
                </div>

                <div className="mt-6 max-w-xl text-foreground/80">
                  {latestRelease.description ? (
                    <RichText data={latestRelease.description} enableGutter={false} />
                  ) : (
                    <p>
                      A new chapter in the Travis Ehrenstrom catalog, recorded with the band and
                      built for late-night drives and front-porch singalongs.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {featuredPrimaryLink && (
                    <a
                      className={buttonVariants({ size: 'lg', variant: 'default' })}
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
                      key={link.id ?? link.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <div className="relative overflow-hidden rounded-[28px] border border-foreground/10 bg-background/60 shadow-[0_24px_60px_-50px_rgba(0,0,0,0.5)]">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-foreground/10 via-transparent to-transparent" />
                  {latestRelease.coverArt && typeof latestRelease.coverArt !== 'string' ? (
                    <div className="relative aspect-square w-full">
                      <Media fill imgClassName="object-cover" resource={latestRelease.coverArt} />
                    </div>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-foreground/5 via-card to-card">
                      <div className="text-center">
                        <p className="text-xs font-mono uppercase tracking-[0.3em] text-foreground/60">
                          Latest Release
                        </p>
                        <p className="mt-2 text-lg font-semibold">{latestRelease.title}</p>
                      </div>
                    </div>
                  )}
                </div>

                {featuredTracks.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-foreground/10 bg-background/80 p-4">
                    <div className="flex items-center justify-between text-[0.65rem] font-mono uppercase tracking-[0.28em] text-foreground/60">
                      <span>Track highlights</span>
                      <span>{featuredTracks.length} picks</span>
                    </div>
                    <ol className="mt-4 space-y-3 text-sm text-foreground/80">
                      {featuredTracks.map((track, index) => (
                        <li className="flex items-center justify-between gap-4" key={track.id ?? index}>
                          <span>
                            {String(index + 1).padStart(2, '0')}. {track.title}
                          </span>
                          {track.duration && (
                            <span className="text-xs text-foreground/50">{track.duration}</span>
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
          <div className="rounded-[32px] border border-foreground/10 bg-card/80 p-10 text-center shadow-[0_24px_60px_-50px_rgba(0,0,0,0.5)]">
            <p className="text-xs font-mono uppercase tracking-[0.32em] text-foreground/60">
              Listening Room
            </p>
            <h2 className="mt-4 text-3xl font-semibold">Releases coming soon</h2>
            <p className="mt-3 text-foreground/70">
              Stay tuned for new recordings, live sessions, and the full discography.
            </p>
          </div>
        </section>
      )}

      <section className="container mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.36em] text-foreground/60">
              Discography
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Release Index</h2>
          </div>
          <p className="text-sm text-foreground/60">
            Tap a record for full details, credits, and links.
          </p>
        </div>

        {gridReleases.length === 0 ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-foreground/15 bg-muted/40 p-8 text-sm text-muted-foreground">
            More releases on deck.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {gridReleases.map((release, index) => {
              const dateLabel = release.releaseDate
                ? formatter.format(new Date(release.releaseDate))
                : ''
              const releaseLinks =
                release.links?.filter((link) => Boolean(link?.url && link?.label)) ?? []
              const projectLabel = resolveProjectLabel(release.project)

              return (
                <article
                  className={cn(
                    'group relative overflow-hidden rounded-[28px] border border-foreground/10 bg-card/80 shadow-[0_24px_60px_-48px_rgba(15,15,15,0.45)] transition-transform duration-300 hover:-translate-y-1',
                    'animate-in fade-in slide-in-from-bottom-6 duration-700',
                  )}
                  key={release.id}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative">
                    {release.coverArt && typeof release.coverArt !== 'string' && (
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Media
                          fill
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          resource={release.coverArt}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 text-[0.65rem] font-mono uppercase tracking-[0.28em] text-foreground/60">
                        <span className="rounded-full border border-foreground/15 bg-background/70 px-3 py-1">
                          {projectLabel}
                        </span>
                        {dateLabel && <span>{dateLabel}</span>}
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold">
                        <Link className="transition-opacity group-hover:opacity-80" href={`/music/${release.slug}`}>
                          {release.title}
                        </Link>
                      </h3>
                      {releaseLinks.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-foreground/70">
                          {releaseLinks.slice(0, 3).map((link) => (
                            <a
                              className="underline underline-offset-4"
                              href={link?.url as string}
                              key={link.id ?? link.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {link?.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
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
  async ({ draft, slug }: { draft: boolean; slug: string }): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
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
