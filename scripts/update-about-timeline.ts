import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Media, Page } from '@/payload-types'
import { about } from '@/endpoints/seed/about'

const resolvePortraitMedia = async ({
  payload,
  page,
}: {
  payload: Payload
  page: Page
}): Promise<Media | null> => {
  const envPortraitId = process.env.ABOUT_PORTRAIT_ID

  if (envPortraitId) {
    const media = await payload.findByID({
      collection: 'media',
      id: envPortraitId,
    })
    if (media) {
      return media
    }
  }

  const layout = Array.isArray(page.layout) ? page.layout : []
  for (const block of layout) {
    if (block?.blockType === 'splitContent' && 'media' in block && block.media) {
      if (typeof block.media === 'object' && block.media) {
        return block.media as Media
      }
      if (typeof block.media === 'string' || typeof block.media === 'number') {
        const media = await payload.findByID({
          collection: 'media',
          id: block.media,
        })
        if (media) {
          return media
        }
      }
    }
  }

  const fallback = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    sort: '-updatedAt',
  })

  return fallback.docs?.[0] ?? null
}

const payload = await getPayload({ config: configPromise })

try {
  console.log('Payload ready')

  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: 'about',
      },
    },
  })

  const page = result.docs?.[0]
  const portrait = page ? await resolvePortraitMedia({ payload, page }) : null

  if (!portrait) {
    console.error(
      'Portrait media not found. Set ABOUT_PORTRAIT_ID or ensure the About page has a splitContent media image.',
    )
    process.exit(1)
  }

  const data = about({ portrait })

  if (!page) {
    const created = await payload.create({
      collection: 'pages',
      data,
      overrideAccess: true,
    })
    console.log(`About page created: ${created.id}`)
  } else {
    const updated = await payload.update({
      collection: 'pages',
      id: page.id,
      data,
      draft: false,
      overrideAccess: true,
      context: {
        disableRevalidate: process.env.DISABLE_REVALIDATE !== 'false',
      },
    })

    console.log(`About page updated: ${updated.id}`)
  }
} finally {
  await payload.destroy()
}
