'use client'

import React from 'react'
import { Play } from 'lucide-react'

import { usePlayer } from '@/providers/Player'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type DetailTrack = {
  title: string
  duration?: string | null
  /** 1-based Bandcamp track index for deep-linking. */
  trackNum: number
}

type DetailLink = {
  label: string
  url: string
}

type Props = {
  releaseId: string
  title: string
  coverUrl: string
  coverAlt: string
  dateLabel: string
  project?: 'teb' | 'travis' | null
  isLive?: boolean | null
  bandcampId?: string | null
  links: DetailLink[]
  tracklist: DetailTrack[]
}

const projectLabels: Record<'teb' | 'travis', string> = {
  teb: 'TEB',
  travis: 'Solo',
}

const resolveProjectLabel = (project?: 'teb' | 'travis' | null) =>
  project && project in projectLabels ? projectLabels[project] : 'Release'

export const ReleaseDetailClient: React.FC<Props> = ({
  releaseId,
  title,
  coverUrl,
  coverAlt,
  dateLabel,
  project,
  isLive,
  bandcampId,
  links,
  tracklist,
}) => {
  const { play } = usePlayer()
  const canPlay = Boolean(bandcampId)

  const playTrack = (trackNum: number, trackTitle?: string) => {
    if (!bandcampId) return
    play({
      releaseId,
      title: trackTitle ?? title,
      releaseTitle: title,
      coverUrl,
      bandcampId,
      trackNum,
    })
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        {/* Cover */}
        <div className="mx-auto w-full max-w-sm">
          <div className="relative aspect-square overflow-hidden rounded-md border border-border shadow-md">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={coverAlt} className="h-full w-full object-cover" src={coverUrl} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary p-6 text-center">
                <span className="font-display text-xl font-extrabold tracking-display">{title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div>
          <p className="font-mono text-label uppercase text-primary">From the discography</p>
          <h1 className="mt-4 font-display font-extrabold tracking-display text-display-lg md:text-display-xl">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
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
            {dateLabel && (
              <span className="font-mono text-label-sm uppercase text-muted-foreground">
                Released {dateLabel}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {canPlay && (
              <button
                className={cn(buttonVariants({ size: 'lg', variant: 'default' }), 'gap-2')}
                onClick={() => playTrack(1)}
                type="button"
              >
                <Play className="h-4 w-4 fill-current" />
                Play
              </button>
            )}
            {links.map((link) => (
              <a
                className={buttonVariants({ size: 'lg', variant: 'outline' })}
                href={link.url}
                key={`${link.label}-${link.url}`}
                rel="noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Tracklist */}
      {tracklist.length > 0 && (
        <div className="mt-12 max-w-2xl">
          <p className="font-mono text-label uppercase text-muted-foreground">Tracklist</p>
          <ol className="mt-4 overflow-hidden rounded-md border border-border bg-card">
            {tracklist.map((track, index) => (
              <li className="border-b border-border last:border-b-0" key={`${track.title}-${index}`}>
                <button
                  className={cn(
                    'group flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors duration-fast ease-teb-out',
                    canPlay
                      ? 'hover:bg-secondary focus:outline-none focus-visible:bg-secondary'
                      : 'cursor-default',
                  )}
                  disabled={!canPlay}
                  onClick={() => playTrack(track.trackNum, track.title)}
                  type="button"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="relative flex h-5 w-5 flex-none items-center justify-center">
                      <span className="font-mono text-sm text-muted-foreground group-hover:opacity-0">
                        {index + 1}
                      </span>
                      {canPlay && (
                        <Play className="absolute h-3.5 w-3.5 fill-current text-primary opacity-0 group-hover:opacity-100" />
                      )}
                    </span>
                    <span className="truncate font-medium text-foreground">{track.title}</span>
                  </span>
                  {track.duration && (
                    <span className="flex-none font-mono text-sm text-muted-foreground">
                      {track.duration}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  )
}

export default ReleaseDetailClient
