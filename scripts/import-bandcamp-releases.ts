import 'dotenv/config'

import path from 'path'

import { JSDOM } from 'jsdom'
import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Media, Release } from '@/payload-types'

const BANDCAMP_BASE_URL = 'https://travisehrenstrom.bandcamp.com'
const BANDCAMP_MUSIC_URL = `${BANDCAMP_BASE_URL}/music`
const TRAVIS_ARTIST = 'Travis Ehrenstrom'
const TEB_ARTIST = 'Travis Ehrenstrom Band'

const bandProjectHints = [
  'teb',
  'travis ehrenstrom band',
  'lady luck',
  'hollinshead',
  'something on the surface',
]
const liveHints = ['live', 'session', 'sessions', 'bbc', 'commons']
const linkPriority = ['Bandcamp', 'Spotify', 'Apple Music']

const normalizeValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const inferProject = (title: string): Release['project'] => {
  const normalized = normalizeValue(title)
  if (bandProjectHints.some((hint) => normalized.includes(hint))) {
    return 'teb'
  }
  return 'travis'
}

const inferIsLive = (title: string) => {
  const normalized = normalizeValue(title)
  return liveHints.some((hint) => normalized.includes(hint))
}

const resolveArtist = (project?: Release['project'] | null) =>
  project === 'teb' ? TEB_ARTIST : TRAVIS_ARTIST

const textNode = (text: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const buildParagraphNode = (text: string) => ({
  type: 'paragraph' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const buildRichText = (content: string | null) => {
  if (!content) return null
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => buildParagraphNode(paragraph))

  if (paragraphs.length === 0) return null

  return {
    root: {
      type: 'root' as const,
      children: paragraphs,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

const formatDuration = (duration?: number | null) => {
  if (!duration || Number.isNaN(duration)) return undefined
  const minutes = Math.floor(duration / 60)
  const seconds = Math.round(duration % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

let spotifyToken: string | null = null
let spotifyTokenExpiresAt = 0

const getSpotifyAccessToken = async () => {
  if (spotifyToken && spotifyTokenExpiresAt > Date.now() + 60_000) {
    return spotifyToken
  }

  const response = await fetch(
    'https://open.spotify.com/get_access_token?reason=transport&productType=web_player',
  )
  if (!response.ok) return null

  const data = (await response.json()) as {
    accessToken?: string
    accessTokenExpirationTimestampMs?: number
  }

  if (!data.accessToken) return null

  spotifyToken = data.accessToken
  spotifyTokenExpiresAt = data.accessTokenExpirationTimestampMs ?? Date.now() + 30 * 60_000
  return spotifyToken
}

const fetchSpotifyLink = async (title: string, artist: string) => {
  const token = await getSpotifyAccessToken()
  if (!token) return null

  const searchUrl = new URL('https://api.spotify.com/v1/search')
  searchUrl.searchParams.set('q', `album:${title} artist:${artist}`)
  searchUrl.searchParams.set('type', 'album')
  searchUrl.searchParams.set('limit', '1')

  const response = await fetch(searchUrl.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) return null

  const data = (await response.json()) as {
    albums?: { items?: Array<{ external_urls?: { spotify?: string } }> }
  }
  const url = data.albums?.items?.[0]?.external_urls?.spotify
  return url ?? null
}

const fetchAppleMusicLink = async (title: string, artist: string) => {
  const searchUrl = new URL('https://itunes.apple.com/search')
  searchUrl.searchParams.set('term', `${artist} ${title}`)
  searchUrl.searchParams.set('entity', 'album')
  searchUrl.searchParams.set('limit', '1')

  const response = await fetch(searchUrl.toString())
  if (!response.ok) return null

  const data = (await response.json()) as {
    results?: Array<{ collectionViewUrl?: string; collectionName?: string }>
  }
  const candidate = data.results?.[0]
  if (!candidate?.collectionViewUrl) return null

  return candidate.collectionViewUrl
}

const buildSearchLink = (service: 'spotify' | 'apple', title: string, artist: string) => {
  const term = encodeURIComponent(`${artist} ${title}`)
  if (service === 'spotify') {
    return `https://open.spotify.com/search/${term}`
  }
  return `https://music.apple.com/us/search?term=${term}`
}

const normalizeLabel = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()

const mergeLinks = (
  existing: NonNullable<Release['links']> | undefined | null,
  incoming: Array<{ label: string; url: string }>,
) => {
  const merged: Array<{ label: string; url: string }> = []
  const seen = new Set<string>()

  const addLink = (link: { label: string; url: string }) => {
    const key = `${normalizeLabel(link.label)}::${link.url}`
    if (seen.has(key)) return
    seen.add(key)
    merged.push(link)
  }

  existing?.forEach((link) => {
    if (link?.label && link?.url) addLink({ label: link.label, url: link.url })
  })
  incoming.forEach(addLink)

  merged.sort((a, b) => {
    const aIndex = linkPriority.indexOf(a.label)
    const bIndex = linkPriority.indexOf(b.label)
    const safeA = aIndex === -1 ? linkPriority.length : aIndex
    const safeB = bIndex === -1 ? linkPriority.length : bIndex
    return safeA - safeB
  })

  return merged
}

const fetchHtml = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'TEB Import Script (https://travisehrenstrom.com)',
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.text()
}

const buildReleaseSlug = (url: string) => {
  const pathname = new URL(url).pathname
  const parts = pathname.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

const parseDiscography = (html: string) => {
  const dom = new JSDOM(html)
  const items = Array.from(dom.window.document.querySelectorAll('#music-grid li.music-grid-item'))

  return items
    .map((item) => {
      const anchor = item.querySelector('a')
      const href = anchor?.getAttribute('href')
      const title = item.querySelector('.title')?.textContent?.trim()
      const artUrl = item.querySelector('img')?.getAttribute('src') ?? undefined

      if (!href || !title) return null

      return {
        title: title.replace(/\s+/g, ' ').trim(),
        url: new URL(href, BANDCAMP_BASE_URL).toString(),
        artUrl,
      }
    })
    .filter((item): item is { title: string; url: string; artUrl: string | undefined } => Boolean(item))
}

const parseReleasePage = async (url: string) => {
  const html = await fetchHtml(url)
  const dom = new JSDOM(html)
  const document = dom.window.document
  const tralbumNode = document.querySelector('[data-tralbum]')
  const tralbumRaw = tralbumNode?.getAttribute('data-tralbum')

  if (!tralbumRaw) {
    throw new Error(`Missing tralbum payload on ${url}`)
  }

  const tralbum = JSON.parse(tralbumRaw) as {
    current?: {
      title?: string
      about?: string | null
      release_date?: string
      publish_date?: string
      new_date?: string
      mod_date?: string
    }
    id?: number
    album_release_date?: string
    trackinfo?: Array<{
      title?: string
      duration?: number
    }>
  }

  const title =
    tralbum.current?.title ||
    document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    'Untitled Release'

  const releaseDateRaw =
    tralbum.current?.release_date ||
    tralbum.album_release_date ||
    tralbum.current?.publish_date ||
    tralbum.current?.new_date ||
    tralbum.current?.mod_date

  const parsedDate = releaseDateRaw ? new Date(releaseDateRaw) : null
  if (!parsedDate || Number.isNaN(parsedDate.valueOf())) {
    throw new Error(`Unable to parse release date for ${title}`)
  }

  const aboutHtml = tralbum.current?.about ?? ''
  const sanitizedAbout = aboutHtml.replace(/<br\s*\/?>/gi, '\n')
  const aboutText = aboutHtml
    ? new JSDOM(`<body>${sanitizedAbout}</body>`).window.document.body.textContent?.trim()
    : ''

  const description = buildRichText(aboutText || null)
  const tracklist =
    tralbum.trackinfo?.map((track) => ({
      title: track.title ?? 'Untitled',
      duration: formatDuration(track.duration),
    })) ?? []

  const artLink =
    document.querySelector('#tralbumArt a.popupImage')?.getAttribute('href') ??
    document.querySelector('#tralbumArt img')?.getAttribute('src') ??
    undefined

  return {
    title,
    releaseDate: parsedDate.toISOString(),
    description,
    tracklist,
    artUrl: artLink,
    bandcampId: tralbum.id ? String(tralbum.id) : undefined,
  }
}

const guessMimeType = (extension: string) => {
  switch (extension.toLowerCase()) {
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    case '.jpeg':
    case '.jpg':
    default:
      return 'image/jpeg'
  }
}

const getOrCreateMedia = async ({
  payload,
  artUrl,
  slug,
  title,
}: {
  payload: Payload
  artUrl?: string
  slug: string
  title: string
}): Promise<Media | null> => {
  if (!artUrl) return null

  const extension = path.extname(new URL(artUrl).pathname) || '.jpg'
  const filename = `bandcamp-${slug}${extension}`
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      filename: {
        equals: filename,
      },
    },
  })

  if (existing.docs?.[0]) {
    return existing.docs[0] as Media
  }

  const response = await fetch(artUrl)
  if (!response.ok) {
    throw new Error(`Failed to download cover art for ${title}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const mimeType = response.headers.get('content-type')?.split(';')[0] || guessMimeType(extension)

  const created = await payload.create({
    collection: 'media',
    data: {
      alt: `${title} cover art`,
    },
    file: {
      data: buffer,
      name: filename,
      mimetype: mimeType,
      size: buffer.length,
    },
    overrideAccess: true,
  })

  return created as Media
}

const findExistingRelease = async ({
  payload,
  slug,
  title,
  url,
}: {
  payload: Payload
  slug: string
  title: string
  url: string
}) => {
  const existing = await payload.find({
    collection: 'releases',
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: {
      or: [
        { slug: { equals: slug } },
        { title: { equals: title } },
        { 'links.url': { equals: url } },
      ],
    },
  })

  return existing.docs?.[0] ?? null
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  }

  try {
    console.log('Fetching Bandcamp discography...')
    const musicHtml = await fetchHtml(BANDCAMP_MUSIC_URL)
    const discography = parseDiscography(musicHtml)

    for (const item of discography) {
      const slug = buildReleaseSlug(item.url)
      if (!slug) {
        console.warn(`Skipping item with missing slug: ${item.url}`)
        summary.skipped += 1
        continue
      }

      const existing = await findExistingRelease({
        payload,
        slug,
        title: item.title,
        url: item.url,
      })

      try {
        const actionLabel = existing ? 'Updating' : 'Importing'
        console.log(`${actionLabel} ${item.title}...`)
        const release = await parseReleasePage(item.url)
        const inferredProject = inferProject(release.title)
        const isLive = inferIsLive(release.title)
        const artist = resolveArtist(inferredProject)
        const [spotifyLink, appleLink] = await Promise.all([
          fetchSpotifyLink(release.title, artist),
          fetchAppleMusicLink(release.title, artist),
        ])

        const streamingLinks = [
          { label: 'Bandcamp', url: item.url },
          {
            label: 'Spotify',
            url: spotifyLink || buildSearchLink('spotify', release.title, artist),
          },
          {
            label: 'Apple Music',
            url: appleLink || buildSearchLink('apple', release.title, artist),
          },
        ]
        const coverArt = await getOrCreateMedia({
          payload,
          artUrl: release.artUrl || item.artUrl,
          slug,
          title: release.title,
        })

        if (!existing) {
          await payload.create({
            collection: 'releases',
            data: {
              _status: 'published',
              title: release.title,
              slug,
              project: inferredProject,
              isLive,
              bandcampId: release.bandcampId,
              releaseDate: release.releaseDate,
              coverArt: coverArt?.id,
              description: release.description,
              tracklist: release.tracklist?.length ? release.tracklist : undefined,
              links: streamingLinks,
            },
            overrideAccess: true,
            context: {
              disableRevalidate: true,
            },
          })

          summary.created += 1
        } else {
          const updateData: Partial<Release> = {}

          if (!existing.project) updateData.project = inferredProject
          if (existing.isLive == null) updateData.isLive = isLive
          if (!existing.bandcampId && release.bandcampId) updateData.bandcampId = release.bandcampId
          if (!existing.coverArt && coverArt) updateData.coverArt = coverArt.id
          if (!existing.description && release.description) updateData.description = release.description
          if (!existing.tracklist?.length && release.tracklist?.length) {
            updateData.tracklist = release.tracklist
          }

          updateData.links = mergeLinks(existing.links, streamingLinks)

          await payload.update({
            collection: 'releases',
            id: existing.id,
            data: updateData,
            overrideAccess: true,
            context: {
              disableRevalidate: true,
            },
          })

          summary.updated += 1
        }
      } catch (error) {
        console.error(`Failed to import ${item.title}:`, error)
        summary.errors += 1
      }
    }
  } finally {
    console.log('Import summary', summary)
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
