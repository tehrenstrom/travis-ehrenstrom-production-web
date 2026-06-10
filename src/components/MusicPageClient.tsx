'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'

import { usePlayer } from '@/providers/Player'
import { cn } from '@/utilities/ui'

export type PopularTrack = {
  /** Stable key, e.g. `${releaseId}-${trackNum}`. */
  id: string
  releaseId: string
  trackTitle: string
  releaseTitle: string
  duration?: string | null
  coverUrl: string
  bandcampId: string
  trackNum: number
}

export type ReleaseCard = {
  id: string
  title: string
  slug: string
  project?: 'teb' | 'travis' | null
  isLive?: boolean | null
  year: string
  coverUrl: string
  coverAlt: string
  bandcampId?: string | null
}

type Props = {
  popularTracks: PopularTrack[]
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

const resolveProjectLabel = (project?: 'teb' | 'travis' | null) =>
  project && project in projectLabels ? projectLabels[project] : 'Release'

const matchesFilter = (release: ReleaseCard, filter: FilterKey) => {
  if (filter === 'all') return true
  if (filter === 'live') return Boolean(release.isLive)
  return release.project === filter
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono text-label uppercase text-muted-foreground">{children}</p>
)

const CoverImage: React.FC<{ release: ReleaseCard }> = ({ release }) =>
  release.coverUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={release.coverAlt}
      className="h-full w-full object-cover"
      loading="lazy"
      src={release.coverUrl}
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center bg-secondary p-3 text-center">
      <span className="font-display text-base font-extrabold tracking-display">
        {release.title}
      </span>
    </span>
  )

const PlayOverlay: React.FC = () => (
  <span className="absolute inset-0 grid place-items-center bg-sepia-900/40 opacity-0 transition-opacity duration-base ease-teb-out group-hover:opacity-100">
    <span className="grid h-[54px] w-[54px] place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_-10px_rgba(197,107,69,0.6)]">
      <Play className="ml-0.5 h-6 w-6 fill-current" />
    </span>
  </span>
)

const ProjectTag: React.FC<{ project?: 'teb' | 'travis' | null; isLive?: boolean | null }> = ({
  project,
  isLive,
}) => (
  <div className="mt-1.5 flex flex-wrap items-center gap-2">
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
        project === 'teb' && 'bg-clay-500/15 text-clay-600 dark:text-clay-300',
        project === 'travis' && 'bg-denim-500/15 text-denim-600 dark:text-denim-300',
        !project && 'bg-secondary text-muted-foreground',
      )}
    >
      {resolveProjectLabel(project)}
    </span>
    {isLive && (
      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide text-muted-foreground">
        Live
      </span>
    )}
  </div>
)

export const MusicPageClient: React.FC<Props> = ({ popularTracks, releases }) => {
  const { play } = usePlayer()
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')

  const counts = useMemo(() => {
    const base = { all: releases.length, teb: 0, travis: 0, live: 0 }
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

  const playRelease = (release: ReleaseCard) => {
    if (!release.bandcampId) return
    play({
      releaseId: release.id,
      title: release.title,
      releaseTitle: release.title,
      coverUrl: release.coverUrl,
      bandcampId: release.bandcampId,
      trackNum: 1,
    })
  }

  return (
    <>
      {/* Popular tracks */}
      {popularTracks.length > 0 && (
        <section className="container mt-12">
          <SectionLabel>Popular tracks</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-2.5 min-[880px]:grid-cols-2">
            {popularTracks.map((track, index) => (
              <button
                className="group flex items-center gap-3.5 rounded-md border border-border bg-card p-2.5 text-left transition-[border-color,box-shadow] duration-base ease-teb-out hover:border-primary hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                key={track.id}
                onClick={() =>
                  play({
                    releaseId: track.releaseId,
                    title: track.trackTitle,
                    releaseTitle: track.releaseTitle,
                    coverUrl: track.coverUrl,
                    bandcampId: track.bandcampId,
                    trackNum: track.trackNum,
                  })
                }
                type="button"
              >
                <span className="w-5 flex-none text-center font-mono text-[13px] text-muted-foreground">
                  {index + 1}
                </span>
                <span className="h-[42px] w-[42px] flex-none overflow-hidden rounded-sm bg-secondary">
                  {track.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="" className="h-full w-full object-cover" loading="lazy" src={track.coverUrl} />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {track.trackTitle}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {track.releaseTitle}
                  </span>
                </span>
                {track.duration && (
                  <span className="flex-none font-mono text-xs text-muted-foreground">
                    {track.duration}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Discography */}
      <section className="container mt-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <SectionLabel>Discography</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = filter.value === activeFilter
              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-label-sm uppercase transition-colors duration-fast ease-teb-out',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  type="button"
                >
                  {filter.label}
                  <span
                    className={cn(
                      'ml-2',
                      isActive ? 'text-primary-foreground/70' : 'text-muted-foreground/70',
                    )}
                  >
                    {counts[filter.value]}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No releases in this view yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 min-[880px]:grid-cols-4">
            {filtered.map((release, index) => {
              const canPlay = Boolean(release.bandcampId)
              return (
                <div
                  className="group opacity-0 animate-fade-up"
                  key={release.id}
                  style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Cover — whole tile plays (or links to details when no audio) */}
                  {canPlay ? (
                    <button
                      aria-label={`Play ${release.title}`}
                      className="relative block aspect-square w-full overflow-hidden rounded-md shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      onClick={() => playRelease(release)}
                      type="button"
                    >
                      <CoverImage release={release} />
                      <PlayOverlay />
                    </button>
                  ) : (
                    <Link
                      aria-label={`${release.title} details`}
                      className="relative block aspect-square w-full overflow-hidden rounded-md shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                      href={`/music/${release.slug}`}
                    >
                      <CoverImage release={release} />
                      <PlayOverlay />
                    </Link>
                  )}

                  {/* Meta */}
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3 className="min-w-0 truncate font-display text-base font-semibold leading-tight">
                      <Link
                        className="transition-colors duration-fast ease-teb-out hover:text-primary"
                        href={`/music/${release.slug}`}
                      >
                        {release.title}
                      </Link>
                    </h3>
                    {release.year && (
                      <span className="flex-none font-mono text-[11px] text-muted-foreground">
                        {release.year}
                      </span>
                    )}
                  </div>
                  <ProjectTag project={release.project} isLive={release.isLive} />
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

export default MusicPageClient
