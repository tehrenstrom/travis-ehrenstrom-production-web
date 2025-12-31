import 'dotenv/config'

import path from 'path'

import { JSDOM } from 'jsdom'
import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Media, Release } from '@/payload-types'

const BANDCAMP_BASE_URL = 'https://travisehrenstrom.bandcamp.com'
const BANDCAMP_MUSIC_URL = `${BANDCAMP_BASE_URL}/music`

const bandProjectHints = [
  'teb',
  'travis ehrenstrom band',
  'lady luck',
  'hollinshead',
  'something on the surface',
]

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

const releaseExists = async ({
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

  return existing.docs?.length > 0
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  const summary = {
    created: 0,
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

      const exists = await releaseExists({
        payload,
        slug,
        title: item.title,
        url: item.url,
      })
      if (exists) {
        console.log(`Skipping existing release: ${item.title}`)
        summary.skipped += 1
        continue
      }

      try {
        console.log(`Importing ${item.title}...`)
        const release = await parseReleasePage(item.url)
        const coverArt = await getOrCreateMedia({
          payload,
          artUrl: release.artUrl || item.artUrl,
          slug,
          title: release.title,
        })

        await payload.create({
          collection: 'releases',
          data: {
            _status: 'published',
            title: release.title,
            slug,
            project: inferProject(release.title),
            releaseDate: release.releaseDate,
            coverArt: coverArt?.id,
            description: release.description,
            tracklist: release.tracklist?.length ? release.tracklist : undefined,
            links: [
              {
                label: 'Bandcamp',
                url: item.url,
              },
            ],
          },
          overrideAccess: true,
          context: {
            disableRevalidate: true,
          },
        })

        summary.created += 1
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
