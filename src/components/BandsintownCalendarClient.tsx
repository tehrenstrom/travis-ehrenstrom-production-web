'use client'

import React, { useMemo, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

export type ArtistFilter = 'all' | 'teb' | 'travis'

export type BandsintownCalendarEvent = {
  artistKey: ArtistFilter
  artistLabel: string
  datetime: string
  id: string
  isFree?: boolean
  isSoldOut?: boolean
  location: string
  ticketUrl?: string
  timestamp: number
  title: string
  url: string
  venueName: string
}

type Props = {
  className?: string
  defaultArtist?: ArtistFilter
  events: BandsintownCalendarEvent[]
  includePast?: boolean
  limit?: number
}

const FILTERS: Array<{ label: string; value: ArtistFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'TEB', value: 'teb' },
  { label: 'Travis (Solo)', value: 'travis' },
]

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
  year: 'numeric',
})

const formatDate = (timestamp: number) => dateFormatter.format(new Date(timestamp))

const applyLimit = (events: BandsintownCalendarEvent[], limit?: number) => {
  if (typeof limit !== 'number' || limit <= 0) {
    return events
  }
  return events.slice(0, limit)
}

export const BandsintownCalendarClient: React.FC<Props> = ({
  className,
  defaultArtist = 'all',
  events,
  includePast = false,
  limit,
}) => {
  const [selectedArtist, setSelectedArtist] = useState<ArtistFilter>(defaultArtist)

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = Date.now()
    const filtered = events.filter((event) => {
      if (selectedArtist === 'all') return true
      return event.artistKey === selectedArtist
    })

    const upcoming = filtered
      .filter((event) => event.timestamp >= now)
      .sort((a, b) => a.timestamp - b.timestamp)
    const past = filtered
      .filter((event) => event.timestamp < now)
      .sort((a, b) => b.timestamp - a.timestamp)

    return {
      upcomingEvents: applyLimit(upcoming, limit),
      pastEvents: applyLimit(past, limit),
    }
  }, [events, limit, selectedArtist])

  return (
    <div
      className={cn(
        'rounded-[32px] border border-foreground/10 bg-card/90 p-6 shadow-[0_28px_70px_-48px_rgba(0,0,0,0.6)] backdrop-blur md:p-8',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = filter.value === selectedArtist
            return (
              <button
                key={filter.value}
                aria-pressed={isActive}
                className={cn(
                  buttonVariants({
                    size: 'sm',
                    variant: isActive ? 'default' : 'outline',
                  }),
                  'text-[0.65rem] uppercase tracking-[0.24em]',
                )}
                onClick={() => setSelectedArtist(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            )
          })}
        </div>
        <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Bandsintown Sync
        </span>
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <h4 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Upcoming</h4>
          {upcomingEvents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No upcoming shows posted yet.</p>
          ) : (
            <ul className="mt-4">
              {upcomingEvents.map((event) => (
                <EventRow event={event} key={event.id} />
              ))}
            </ul>
          )}
        </div>

        {includePast && (
          <div>
            <h4 className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Past</h4>
            {pastEvents.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No past shows posted yet.</p>
            ) : (
              <ul className="mt-4">
                {pastEvents.map((event) => (
                  <EventRow event={event} key={event.id} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const EventRow: React.FC<{ event: BandsintownCalendarEvent }> = ({ event }) => {
  const title = event.title?.trim() || event.venueName
  const primaryUrl = event.ticketUrl || event.url
  const primaryLabel = event.isSoldOut ? 'Sold out' : event.isFree ? 'Free' : 'Tickets'

  return (
    <li className="grid gap-4 border-b border-foreground/10 py-5 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {formatDate(event.timestamp)}
      </div>
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{event.location}</div>
        <span className="mt-3 inline-flex rounded-full border border-foreground/15 px-3 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-foreground/70">
          {event.artistLabel}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {event.isSoldOut ? (
          <span className="rounded-full border border-foreground/20 px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
            Sold Out
          </span>
        ) : (
          <a
            className={cn(
              buttonVariants({ size: 'sm', variant: 'outline' }),
              'text-[0.65rem] uppercase tracking-[0.24em]',
            )}
            href={primaryUrl}
            rel="noreferrer"
            target="_blank"
          >
            {primaryLabel}
          </a>
        )}
        <a
          className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground underline underline-offset-4"
          href={event.url}
          rel="noreferrer"
          target="_blank"
        >
          Details
        </a>
      </div>
    </li>
  )
}
