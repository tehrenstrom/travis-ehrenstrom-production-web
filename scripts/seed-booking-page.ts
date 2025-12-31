import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Media, Page } from '@/payload-types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IMAGES_DIR = path.resolve(__dirname, '../tmp/epk-images')
const MANIFEST_PATH = path.join(IMAGES_DIR, 'manifest.json')

// Content from the old booking page
const TRAVIS_SOLO_BIO = `**Travis Ehrenstrom** is a Central Oregon-based singer-songwriter who blends heartfelt storytelling with rich acoustic melodies. Born and raised in Sisters, Oregon, he discovered his love for music through family influences and folk festivals, learning the craft of songwriting at an early age from artists like Kelly Joe Phelps, Meg Hutchinson, and Willy Porter. Inspired by legendary songwriters such as John Prine, Jackson Browne, Joni Mitchell, and Bob Dylan, Travis has spent over two decades crafting songs that explore connection, nature, and the shared human experience.

As a solo artist, Travis delivers warm, introspective performances that embrace the power of lyrics and melody in intimate settings. Over the years, he has captivated audiences from cozy house concerts to renowned festivals such as **Cascade Equinox, 4 Peaks Music Festival, and the Sisters Folk Festival**. Along the way, Travis has shared stages with acclaimed acts like _The Head and The Heart, Jackson Browne, David Ramirez, The Mother Hips, Goose, Leftover Salmon, The Brothers Comatose, and many more_. These opportunities, coupled with his heartfelt live shows, have cemented his reputation as a mainstay in the Central Oregon music scene.

Rooted in the landscapes of the Pacific Northwest, Travis honors the traditions of folk music while creating a sound that feels both timeless and fresh. His warm tenor voice and relatable songwriting invite listeners to slow down, lean in, and find meaning in the moments shared. Whether performing in a living room or on a festival stage, he forges a genuine connection with his audience, like a trusted friend sharing songs by the campfire, and leaves listeners feeling uplifted and part of a community.`

const TEB_BIO = `The musical collective TEB—known to Oregonians as the Travis Ehrenstrom Band— transcends boundaries while blending funky fusion-rock jams with the soulful essence of singer-songwriter Travis Ehrenstrom.

Songwriter Travis Ehrenstrom has been captivating audiences for over a decade as he writes of real life experiences and adventurous endeavors. However, it's with TEB that the true alchemy unfolds; a collaboration of six exceptional musicians, each adding their unique flavor to the mix. The lineup includes Travis Ehrenstrom (vocals/guitar), Patrick Pearsall (bass/vocals), Conner Bennett (guitar), Patrick Ondrozeck (keys), and Kyle Pickard (drums).

TEB's sonic landscape defies easy categorization. The music blends unexpected turns with open-ended intentions, allowing the band to explore and create in the moment. The band emerged from the post-COVID shadows with a new album, "Hollinshead," a 5-song collection showcasing the sound of the band.

A decade of playing together has allowed TEB to produce a rich tapestry of live shows and memorable moments, as well as a dedication to the art of musical expression. What started as random practices and stands at local breweries has moved to multiple recordings and slots at festivals such as Sisters Folk Festival, 4 Peaks Music Festival, Cascade Equinox, Bend's Fall Festival, Cruxapalooza, and Oktoberfest.

"Every time I play with those guys, there's one of those moments where it's just like, 'Whoa! I can't believe we just did that,'" says Ehrenstrom.

This sentiment encapsulates the essence of TEB's music—a journey marked by moments that can't be scripted but resonate deeply. Listen to the recordings, catch TEB live, and hear for yourself!`

const PRESS_QUOTES = [
  {
    quote: `Ehrenstrom's songwriting is the through line, and he's cooked up some winners. The 10 tracks explore nearly every corner of the roots-rock realm, from the Tom Petty-esque opener "Wouldn't Have It Any Other Way" to the jangly, upbeat "Heavy Light" to the riff-y stomper "I Watched the World End." Elsewhere, "Sara" rides a soulful organ riff into a dark '60s pop groove, while the stuttering piano chords of "Are You Chicago?" recall Ben Folds at his best.`,
    attribution: 'Brian McElhiney',
    source: null,
  },
  {
    quote: `But it's the melodies that stand out the most. Ehrenstrom has an immensely likable and relatable voice, which he uses to great effect on the title track's climbing chorus hook. That song would be the best track here if not for late-album sleeper "Holding on to Nothing," a heart-wrenching look at a relationship gone stagnant (complete with violin and cello from Ehrenstrom) that should strike a chord with anyone who's ever loved anyone.`,
    attribution: 'Brian McElhiney',
    source: null,
  },
  {
    quote: `(Remain A Mystery is) an engaging listen, an eclectic, 21st century take on folk-pop-rock-whatever. Fans of Wilco, Ryan Adams and My Morning Jacket's mellower moments should take notice.`,
    attribution: 'Ben Salmon',
    source: 'The Bend Bulletin',
  },
  {
    quote: `Ehrenstrom's sweet-tenored songs seem like a cozy warm blanket, a comforting reminder about what is fundamentally important.`,
    attribution: 'Phil Busse',
    source: 'The Source Weekly',
  },
]

const RECENT_PRESS = [
  { title: 'Lady Luck Album Preview', url: 'https://www.travisehrenstrom.com/blog/lady-luck-preview' },
  { title: 'Hollinshead Album Release Announcement - Bend Bulletin', url: 'https://www.bendbulletin.com/localstate/travis-ehrenstrom-band-releases-new-ep/article_abc123.html' },
  { title: 'Travis Ehrenstrom Interview - Lost in the Manor', url: 'https://www.lostinthemanor.com/travis-ehrenstrom' },
  { title: 'Hollinshead Album Review - Sono Music', url: 'https://sonomusic.com/hollinshead-review' },
  { title: 'Hollinshead Album Review - IndieMusicFlix', url: 'https://indiemusicflix.com/hollinshead' },
]

const DISCOGRAPHY = [
  { title: 'Lady Luck', year: '2024' },
  { title: 'Hollinshead', year: '2023' },
  { title: 'Selections', year: '2020' },
  { title: 'A Song For Every State Part One (magazine)', year: '2020' },
  { title: 'Northwest Americana', year: '2019' },
  { title: 'Something on the Surface', year: '2018' },
  { title: 'Remain A Mystery', year: '2013' },
  { title: 'Somewhere In Between', year: '2007' },
]

const NOTABLE_PERFORMANCES = [
  '2016 Sisters Folk Festival',
  '2017 4 Peaks Music Festival',
  '2023 McMenamins NYE',
  '2023 Cascade Equinox Festival',
  '2024 4 Peaks Music Festival',
  '2024 Cascade Equinox Festival',
]

const BAND_MEMBERS = [
  { name: 'Travis Ehrenstrom', role: 'guitars, vox' },
  { name: 'Patrick Pearsall', role: 'bass, vox' },
  { name: 'Connor Bennett', role: 'guitars, vox' },
  { name: 'Pat Ondrozeck', role: 'keys' },
  { name: 'Kyle Pickard', role: 'drums, percussion' },
]

const YOUTUBE_VIDEOS = [
  { youtubeId: 'rGZGFFtIvUA', title: 'TEB Live at Volcanic Theatre Pub' },
  { youtubeId: 'sBKTnIlxg0A', title: 'Travis Ehrenstrom - Acoustic Session' },
  { youtubeId: 'NvoRfz8yfNM', title: 'TEB - Live Performance' },
  { youtubeId: 'dQX6dus6ntU', title: 'Travis Ehrenstrom Band - Studio Session' },
]

// Rich text helpers
const textNode = (text: string, format: number = 0) => ({
  type: 'text' as const,
  detail: 0,
  format,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const paragraphNode = (children: ReturnType<typeof textNode>[]) => ({
  type: 'paragraph' as const,
  children,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const headingNode = (text: string, tag: 'h1' | 'h2' | 'h3' = 'h2') => ({
  type: 'heading' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

const parseInlineFormatting = (text: string): ReturnType<typeof textNode>[] => {
  const segments: ReturnType<typeof textNode>[] = []
  const regex = /(\*\*([^*]+)\*\*)|(_([^_]+)_)|([^*_]+)/g
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      segments.push(textNode(match[2], 1)) // format 1 = bold
    } else if (match[4]) {
      segments.push(textNode(match[4], 2)) // format 2 = italic
    } else if (match[5]) {
      segments.push(textNode(match[5]))
    }
  }
  return segments
}

const buildRichText = (markdown: string) => {
  const paragraphs = markdown.split(/\n\n+/).filter(Boolean)
  const children: unknown[] = []

  for (const para of paragraphs) {
    // Check for headings (## Heading)
    const headingMatch = para.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const tag = `h${level}` as 'h1' | 'h2' | 'h3'
      children.push(headingNode(headingMatch[2], tag))
      continue
    }

    // Parse inline formatting
    const segments = parseInlineFormatting(para)
    if (segments.length > 0) {
      children.push(paragraphNode(segments))
    }
  }

  return {
    root: {
      type: 'root' as const,
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

const buildHeroRichText = () => ({
  root: {
    type: 'root' as const,
    children: [
      headingNode('Press Kit', 'h1'),
      paragraphNode([textNode('Electronic Press Kit for Travis Ehrenstrom and TEB')]),
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

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

const importPressPhotos = async (payload: Payload): Promise<Media[]> => {
  console.log('Importing press photos...')

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.log('No manifest found, skipping image import')
    return []
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
  const imported: Media[] = []

  for (const image of manifest.images) {
    const imagePath = path.join(IMAGES_DIR, image.filename)
    if (!fs.existsSync(imagePath)) continue

    const extension = path.extname(imagePath)

    // Check if exists
    const existing = await payload.find({
      collection: 'media',
      limit: 1,
      pagination: false,
      overrideAccess: true,
      where: {
        filename: { equals: image.filename },
      },
    })

    if (existing.docs?.[0]) {
      // Update isPressPhoto if needed
      const doc = existing.docs[0] as Media
      if (!doc.isPressPhoto) {
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: { isPressPhoto: true },
          overrideAccess: true,
        })
      }
      imported.push(doc)
      console.log(`  ✓ Existing: ${image.filename}`)
      continue
    }

    // Import new
    const buffer = fs.readFileSync(imagePath)
    const mimeType = guessMimeType(extension)

    const created = await payload.create({
      collection: 'media',
      data: {
        alt: image.alt,
        isPressPhoto: true,
      },
      file: {
        data: buffer,
        name: image.filename,
        mimetype: mimeType,
        size: buffer.length,
      },
      overrideAccess: true,
    })

    imported.push(created as Media)
    console.log(`  ✓ Imported: ${image.filename}`)
  }

  return imported
}

const run = async () => {
  console.log('Booking Page Seed Script')
  console.log('========================\n')

  const payload = await getPayload({ config: configPromise })

  try {
    // Import press photos first
    const pressPhotos = await importPressPhotos(payload)
    console.log(`\nImported ${pressPhotos.length} press photos\n`)

    // Check if booking page exists
    const existingPage = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'booking' },
      },
      limit: 1,
    })

    if (existingPage.docs?.[0]) {
      console.log('Booking page already exists. Updating...')
      await payload.delete({
        collection: 'pages',
        id: existingPage.docs[0].id,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
      })
    }

    // Build page layout
    const layout: Page['layout'] = [
      // Solo artist bio
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: buildRichText(`## Travis Ehrenstrom\n\n${TRAVIS_SOLO_BIO}`),
          },
        ],
      },
      // TEB band bio
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: buildRichText(`## Travis Ehrenstrom Band\n\n${TEB_BIO}`),
          },
        ],
      },
      // Photo gallery
      {
        blockType: 'photoGallery',
        heading: 'Press Photos',
        subheading: 'Gallery',
        populateBy: 'pressPhotos',
        maxPhotos: 20,
        layout: 'scroll',
      },
      // Discography
      {
        blockType: 'discographyList',
        heading: 'Discography',
        subheading: 'Releases',
        populateBy: 'manual',
        releases: DISCOGRAPHY.map((r) => ({
          title: r.title,
          year: r.year,
        })),
        showLink: true,
      },
      // Press quotes
      {
        blockType: 'pressQuotes',
        heading: 'Press',
        quotes: PRESS_QUOTES.map((q) => ({
          quote: q.quote,
          attribution: q.attribution,
          source: q.source,
        })),
        recentPress: RECENT_PRESS.map((p) => ({
          title: p.title,
          url: p.url,
        })),
      },
      // Notable performances (using content block)
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: {
              root: {
                type: 'root' as const,
                children: [
                  headingNode('Notable Performances', 'h2'),
                  ...NOTABLE_PERFORMANCES.map((perf) => paragraphNode([textNode(`• ${perf}`)])),
                ],
                direction: 'ltr' as const,
                format: '' as const,
                indent: 0,
                version: 1,
              },
            },
          },
        ],
      },
      // Band members
      {
        blockType: 'teamGrid',
        heading: 'TEB is',
        members: BAND_MEMBERS.map((m) => ({
          name: m.name,
          role: m.role,
        })),
        layout: 'list',
      },
      // Videos
      {
        blockType: 'videoEmbed',
        heading: 'Video',
        videos: YOUTUBE_VIDEOS.map((v) => ({
          youtubeId: v.youtubeId,
          title: v.title,
        })),
        layout: 'featured',
      },
      // Contact CTA
      {
        blockType: 'cta',
        richText: {
          root: {
            type: 'root' as const,
            children: [
              headingNode('Press Contact', 'h2'),
              paragraphNode([textNode('For booking inquiries and press requests:')]),
              paragraphNode([textNode('travisehrenstrom@gmail.com', 1)]),
              paragraphNode([textNode('(541) 749-8416')]),
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            version: 1,
          },
        },
      },
    ]

    // Create the booking page
    const bookingPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'Press Kit',
        slug: 'booking',
        _status: 'published',
        hero: {
          type: 'lowImpact',
          richText: buildHeroRichText(),
        },
        layout,
        meta: {
          title: 'Press Kit - Travis Ehrenstrom Band',
          description:
            'Electronic Press Kit for Travis Ehrenstrom and TEB. Bios, press photos, discography, videos, and booking information.',
        },
      },
      overrideAccess: true,
      context: {
        disableRevalidate: true,
      },
    })

    console.log('========================')
    console.log('✓ Booking page created successfully!')
    console.log(`  ID: ${bookingPage.id}`)
    console.log(`  Slug: /booking`)
    console.log(`  Status: Published`)
    console.log('\nThe page includes:')
    console.log('  • Travis Ehrenstrom solo bio')
    console.log('  • TEB band bio')
    console.log('  • Photo gallery (auto-populated from press photos)')
    console.log('  • Discography list')
    console.log('  • Press quotes and recent press links')
    console.log('  • Notable performances')
    console.log('  • Band members')
    console.log('  • YouTube video gallery')
    console.log('  • Contact information')
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})

