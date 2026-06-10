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
  pastPageSize?: number
}

const FILTERS: Array<{ label: string; value: ArtistFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'TEB', value: 'teb' },
  { label: 'Solo', value: 'travis' },
]

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' })
const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric' })
const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })

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
  pastPageSize = 10,
}) => {
  const [selectedArtist, setSelectedArtist] = useState<ArtistFilter>(defaultArtist)
  const [pastPage, setPastPage] = useState(1)

  // Reset past page when artist filter changes
  const handleArtistChange = (artist: ArtistFilter) => {
    setSelectedArtist(artist)
    setPastPage(1)
  }

  const { upcomingEvents, allPastEvents } = useMemo(() => {
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
      allPastEvents: past,
    }
  }, [events, limit, selectedArtist])

  // Paginate past events
  const totalPastPages = Math.ceil(allPastEvents.length / pastPageSize)
  const paginatedPastEvents = allPastEvents.slice(
    (pastPage - 1) * pastPageSize,
    pastPage * pastPageSize,
  )

  const upcomingCount = upcomingEvents.length
  const pastCount = allPastEvents.length

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => {
          const isActive = filter.value === selectedArtist
          return (
            <button
              key={filter.value}
              aria-pressed={isActive}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors duration-fast ease-teb-out',
                isActive
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-transparent text-foreground hover:bg-secondary',
              )}
              onClick={() => handleArtistChange(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          )
        })}
        <span className="ml-auto font-mono text-2xs text-muted-foreground">
          {upcomingCount} upcoming
        </span>
      </div>

      <div className="mt-6 space-y-10">
        <section>
          <p className="font-mono text-label uppercase text-primary">Upcoming</p>
          <h4 className="mt-2 font-display text-2xl font-extrabold tracking-display">Next shows</h4>

          {upcomingEvents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No upcoming shows posted yet.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {upcomingEvents.map((event) => (
                <EventRow event={event} key={event.id} variant="upcoming" />
              ))}
            </ul>
          )}
        </section>

        {includePast && (
          <section className="border-t border-border pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-label uppercase text-primary">Past</p>
                <h4 className="mt-2 font-display text-2xl font-extrabold tracking-display">
                  Archive
                </h4>
              </div>
              <span className="font-mono text-2xs uppercase tracking-label text-muted-foreground">
                {pastCount} dates
              </span>
            </div>

            {paginatedPastEvents.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No past shows posted yet.</p>
            ) : (
              <>
                <ul className="mt-5 space-y-3">
                  {paginatedPastEvents.map((event) => (
                    <EventRow event={event} key={event.id} variant="past" />
                  ))}
                </ul>

                {/* Pagination controls */}
                {totalPastPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      className={cn(
                        buttonVariants({ size: 'sm', variant: 'secondary' }),
                        pastPage === 1 && 'pointer-events-none opacity-40',
                      )}
                      disabled={pastPage === 1}
                      onClick={() => setPastPage((p) => Math.max(1, p - 1))}
                      type="button"
                    >
                      Prev
                    </button>
                    <span className="font-mono text-2xs text-muted-foreground">
                      Page {pastPage} of {totalPastPages}
                    </span>
                    <button
                      className={cn(
                        buttonVariants({ size: 'sm', variant: 'secondary' }),
                        pastPage === totalPastPages && 'pointer-events-none opacity-40',
                      )}
                      disabled={pastPage === totalPastPages}
                      onClick={() => setPastPage((p) => Math.min(totalPastPages, p + 1))}
                      type="button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

const EventRow: React.FC<{ event: BandsintownCalendarEvent; variant: 'upcoming' | 'past' }> = ({
  event,
  variant,
}) => {
  const title = event.title?.trim() || event.venueName
  const primaryUrl = event.ticketUrl || event.url
  const isPast = variant === 'past'

  const date = new Date(event.timestamp)
  const month = monthFormatter.format(date)
  const day = dayFormatter.format(date)
  const weekday = weekdayFormatter.format(date)
  const time = timeFormatter.format(date)
  const year = date.getFullYear()

  const isTeb = event.artistKey === 'teb'

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-5 rounded-md border border-border bg-card p-5',
        'transition-colors duration-base ease-teb-out hover:border-foreground/35 hover:bg-secondary',
        isPast && 'opacity-70',
      )}
    >
      <div className="w-[74px] flex-none border-r border-border pr-5 text-center">
        <p className="font-mono text-2xs uppercase tracking-label text-primary">{month}</p>
        <p className="mt-0.5 font-display text-[34px] font-extrabold leading-none text-foreground">
          {day}
        </p>
        <p className="mt-1 font-mono text-2xs uppercase text-muted-foreground">{weekday}</p>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold leading-tight text-foreground">{title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{event.location}</span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{isPast ? year : time}</span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
              isTeb
                ? 'bg-clay-500/15 text-clay-600 dark:text-clay-300'
                : 'bg-denim-500/15 text-denim-600 dark:text-denim-300',
            )}
          >
            {isTeb ? 'TEB' : 'Solo'}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-none items-center justify-between gap-3 border-t border-border pt-3 sm:w-auto sm:justify-start sm:border-t-0 sm:pt-0">
        {event.isSoldOut ? (
          <span className="font-mono text-sm font-semibold text-muted-foreground">Sold out</span>
        ) : (
          event.isFree && (
            <span className="font-mono text-sm font-semibold text-moss-600 dark:text-moss-400">
              Free
            </span>
          )
        )}
        {!isPast && !event.isSoldOut ? (
          <a
            className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }))}
            href={primaryUrl}
            rel="noreferrer"
            target="_blank"
          >
            Tickets
          </a>
        ) : (
          <a
            className={cn(buttonVariants({ size: 'sm', variant: 'secondary' }))}
            href={event.url}
            rel="noreferrer"
            target="_blank"
          >
            Details
          </a>
        )}
      </div>
    </li>
  )
}
