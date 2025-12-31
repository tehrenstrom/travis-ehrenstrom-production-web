'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type ReleaseLink = {
  label: string
  url: string
}

type ReleaseCard = {
  id: string
  title: string
  slug: string
  project?: 'teb' | 'travis' | null
  isLive?: boolean | null
  releaseDateLabel?: string
  coverArtUrl?: string
  coverArtAlt?: string
  bandcampId?: string | null
  links?: ReleaseLink[]
}

type Props = {
  releases: ReleaseCard[]
}

type FilterKey = 'all' | 'teb' | 'travis' | 'live'

const FILTERS: Array<{ label: string; value: FilterKey }> = [
  { label: 'All', value: 'all' },
  { label: 'TEB', value: 'teb' },
  { label: 'Solo', value: 'travis' },
  { label: 'Live', value: 'live' },
]

const projectLabels: Record<'teb' | 'travis', string> = {
  teb: 'TEB',
  travis: 'Solo',
}

const linkOrder = ['Bandcamp', 'Spotify', 'Apple Music']

const sortLinks = (links: ReleaseLink[] = []) =>
  [...links].sort((a, b) => {
    const aIndex = linkOrder.indexOf(a.label)
    const bIndex = linkOrder.indexOf(b.label)
    const safeA = aIndex === -1 ? linkOrder.length : aIndex
    const safeB = bIndex === -1 ? linkOrder.length : bIndex
    return safeA - safeB
  })

const buildEmbedUrl = (bandcampId: string) =>
  `https://bandcamp.com/EmbeddedPlayer/album=${bandcampId}/size=small/bgcol=111111/linkcol=faf5ed/tracklist=false/transparent=true/`

const matchesFilter = (release: ReleaseCard, filter: FilterKey) => {
  if (filter === 'all') return true
  if (filter === 'live') return Boolean(release.isLive)
  return release.project === filter
}

export const MusicReleaseGridClient: React.FC<Props> = ({ releases }) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [activeReleaseId, setActiveReleaseId] = useState<string | null>(null)

  const togglePlayer = (releaseId: string) => {
    setActiveReleaseId((current) => (current === releaseId ? null : releaseId))
  }

  const counts = useMemo(() => {
    const base = {
      all: releases.length,
      teb: 0,
      travis: 0,
      live: 0,
    }
    releases.forEach((release) => {
      if (release.project === 'teb') base.teb += 1
      if (release.project === 'travis') base.travis += 1
      if (release.isLive) base.live += 1
    })
    return base
  }, [releases])

  const filtered = useMemo(
    () => releases.filter((release) => matchesFilter(release, activeFilter)),
    [activeFilter, releases],
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = filter.value === activeFilter
            const count = counts[filter.value]
            return (
              <button
                key={filter.value}
                className={cn(
                  buttonVariants({
                    size: 'sm',
                    variant: isActive ? 'default' : 'outline',
                  }),
                  'text-label-sm uppercase tracking-stamp',
                )}
                onClick={() => setActiveFilter(filter.value)}
                type="button"
              >
                {filter.label}
                <span className="ml-2 text-xs text-muted-foreground/80">{count}</span>
              </button>
            )
          })}
        </div>
        <span className="text-label-sm uppercase tracking-stamp text-muted-foreground">
          Click play to listen on-site
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="vintage-card p-8 text-center text-sm text-muted-foreground border-dashed">
          No releases in this view yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((release, index) => {
            const releaseLinks = sortLinks(release.links)
            const projectLabel =
              release.project && release.project in projectLabels
                ? projectLabels[release.project]
                : 'Release'
            const hasPlayer = Boolean(release.bandcampId)
            const isActive = activeReleaseId === release.id
            const embedUrl = release.bandcampId ? buildEmbedUrl(release.bandcampId) : ''

            return (
              <article
                className={cn(
                  'group vintage-card vintage-card-hover overflow-hidden',
                  'opacity-0 animate-fade-up',
                )}
                key={release.id}
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/0 to-black/0 transition-all duration-500 group-hover:from-amber-900/20 group-hover:to-black/30 pointer-events-none" />
                  <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.18)] pointer-events-none" />
                  {release.coverArtUrl ? (
                    <img
                      alt={release.coverArtAlt || release.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      loading="lazy"
                      src={release.coverArtUrl}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <div className="text-center">
                        <p className="text-label-sm uppercase tracking-stamp text-muted-foreground">
                          {projectLabel}
                        </p>
                        <p className="mt-2 font-display text-lg">{release.title}</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {hasPlayer ? (
                      <button
                        aria-pressed={isActive}
                        className={cn(buttonVariants({ size: 'sm', variant: 'default' }), 'gap-2')}
                        onClick={() => togglePlayer(release.id)}
                        type="button"
                      >
                        <Play className="h-4 w-4" />
                        {isActive ? 'Hide' : 'Play'}
                      </button>
                    ) : (
                      <Link
                        className={cn(buttonVariants({ size: 'sm', variant: 'default' }), 'gap-2')}
                        href={`/music/${release.slug}`}
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className={cn(
                        'px-2 py-1 text-label-sm uppercase tracking-stamp',
                        'border border-accent/30 bg-accent/5 text-accent',
                      )}
                    >
                      {projectLabel}
                    </span>
                    {release.isLive && (
                      <span className="px-2 py-1 text-label-sm uppercase tracking-stamp border border-foreground/20 bg-foreground/5 text-muted-foreground">
                        Live
                      </span>
                    )}
                    {release.releaseDateLabel && (
                      <span className="text-label-sm uppercase tracking-stamp text-muted-foreground">
                        {release.releaseDateLabel}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl">
                    <Link
                      className="transition-colors duration-200 hover:text-accent"
                      href={`/music/${release.slug}`}
                    >
                      {release.title}
                    </Link>
                  </h3>

                  {releaseLinks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {releaseLinks.slice(0, 3).map((link) => (
                        <a
                          className="text-label-sm uppercase tracking-stamp text-muted-foreground underline underline-offset-4 decoration-1 hover:text-accent transition-colors"
                          href={link.url}
                          key={`${release.id}-${link.label}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {hasPlayer && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        aria-pressed={isActive}
                        className={cn(
                          buttonVariants({ size: 'sm', variant: isActive ? 'default' : 'outline' }),
                          'gap-2 text-label-sm uppercase tracking-stamp',
                        )}
                        onClick={() => togglePlayer(release.id)}
                        type="button"
                      >
                        <Play className="h-4 w-4" />
                        {isActive ? 'Hide Player' : 'Play'}
                      </button>
                      <Link
                        className={cn(
                          buttonVariants({ size: 'sm', variant: 'outline' }),
                          'text-label-sm uppercase tracking-stamp',
                        )}
                        href={`/music/${release.slug}`}
                      >
                        Details
                      </Link>
                    </div>
                  )}

                  {hasPlayer && isActive && embedUrl && (
                    <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-3">
                      <iframe
                        className="w-full h-[110px] border-0"
                        loading="lazy"
                        src={embedUrl}
                        title={`${release.title} Bandcamp player`}
                      />
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    <span className="ornament-diamond text-accent/30" />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
