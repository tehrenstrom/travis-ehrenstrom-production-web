import { BandsintownCalendarClient } from '@/components/BandsintownCalendarClient'
import type { ArtistFilter, BandsintownCalendarEvent } from '@/components/BandsintownCalendarClient'

type Props = {
  className?: string
  defaultArtist?: ArtistFilter
  includePast?: boolean
  limit?: number
}

type ArtistConfig = {
  key: Exclude<ArtistFilter, 'all'>
  label: string
  name: string
}

type BandsintownOffer = {
  type?: string | null
  url?: string | null
}

type BandsintownVenue = {
  name?: string | null
  city?: string | null
  region?: string | null
  country?: string | null
  location?: string | null
}

type BandsintownEventResponse = {
  id?: string | number
  artist?: {
    name?: string | null
  }
  artist_id?: string | number
  datetime?: string | null
  free?: boolean | null
  offers?: BandsintownOffer[] | null
  sold_out?: boolean | null
  title?: string | null
  url?: string | null
  venue?: BandsintownVenue | null
}

const ARTISTS: ArtistConfig[] = [
  {
    key: 'teb',
    label: 'TEB',
    name: 'Travis Ehrenstrom Band',
  },
  {
    key: 'travis',
    label: 'Travis (Solo)',
    name: 'Travis Ehrenstrom',
  },
]

const resolveAppId = () => {
  const envAppId = process.env.BANDSINTOWN_APP_ID || process.env.NEXT_PUBLIC_BANDSINTOWN_APP_ID
  if (envAppId) return envAppId

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (serverUrl) {
    try {
      return `js_${new URL(serverUrl).hostname}`
    } catch {
      return `js_${serverUrl.replace(/^https?:\/\//, '')}`
    }
  }

  if (process.env.VERCEL_URL) {
    return `js_${process.env.VERCEL_URL}`
  }

  return 'js_localhost'
}

const buildLocation = (venue?: BandsintownVenue | null) => {
  if (!venue) return 'Location TBA'
  if (venue.location) return venue.location
  const region = venue.region || venue.country
  const parts = [venue.city, region].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Location TBA'
}

const buildEventTitle = (event: BandsintownEventResponse) => {
  if (event.title) return event.title
  if (event.venue?.name) return event.venue.name
  return 'Live show'
}

const findTicketUrl = (offers?: BandsintownOffer[] | null, fallback?: string | null) => {
  const ticket = offers?.find((offer) => offer?.url)?.url
  return ticket || fallback || ''
}

const normalizeEvent = (
  event: BandsintownEventResponse,
  artist: ArtistConfig,
): BandsintownCalendarEvent | null => {
  if (!event.datetime || !event.url) return null
  const timestamp = Date.parse(event.datetime)
  if (Number.isNaN(timestamp)) return null

  return {
    artistKey: artist.key,
    artistLabel: artist.label,
    datetime: event.datetime,
    id: String(event.id ?? `${artist.key}-${event.datetime}`),
    isFree: Boolean(event.free),
    isSoldOut: Boolean(event.sold_out),
    location: buildLocation(event.venue),
    ticketUrl: findTicketUrl(event.offers, event.url) || undefined,
    timestamp,
    title: buildEventTitle(event),
    url: event.url,
    venueName: event.venue?.name || 'Venue TBA',
  }
}

const fetchArtistEvents = async (artist: ArtistConfig): Promise<BandsintownCalendarEvent[]> => {
  const appId = resolveAppId()
  const url = new URL(
    `https://rest.bandsintown.com/V3.1/artists/${encodeURIComponent(artist.name)}/events`,
  )
  url.searchParams.set('app_id', appId)
  url.searchParams.set('date', 'all')

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 600 } })
    if (!response.ok) return []
    const data: BandsintownEventResponse[] = await response.json()
    if (!Array.isArray(data)) return []

    return data
      .map((event) => normalizeEvent(event, artist))
      .filter((event): event is BandsintownCalendarEvent => Boolean(event))
  } catch {
    return []
  }
}

export const BandsintownCalendar = async ({
  className,
  defaultArtist = 'all',
  includePast,
  limit,
}: Props) => {
  const results = await Promise.all(ARTISTS.map((artist) => fetchArtistEvents(artist)))
  const allEvents = results.flat()
  const uniqueEvents = Array.from(new Map(allEvents.map((event) => [event.id, event])).values())

  return (
    <BandsintownCalendarClient
      className={className}
      defaultArtist={defaultArtist}
      events={uniqueEvents}
      includePast={includePast}
      limit={limit}
    />
  )
}
