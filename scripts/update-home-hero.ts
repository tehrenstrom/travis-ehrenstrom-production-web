import fs from 'fs'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const buildHeroRichText = () => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'Central Oregon • Jam-Rock Americana',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h4' as const,
        version: 1,
      },
      {
        type: 'heading' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'Travis Ehrenstrom Band (TEB)',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h1' as const,
        version: 1,
      },
      {
        type: 'paragraph' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text: 'A laid-back PNW band blending jam-rock, Americana, and folk.',
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const payload = await getPayload({ config: configPromise })
console.log('Payload ready')

const result = await payload.find({
  collection: 'pages',
  limit: 1,
  pagination: false,
  where: {
    slug: {
      equals: 'home',
    },
  },
})

const page = result.docs?.[0]

if (!page) {
  console.error('Home page not found.')
  process.exit(1)
}

console.log('Updating page', page.id)
const updatedLayout = Array.isArray(page.layout)
  ? page.layout.map((block) => {
      if (block.blockType !== 'showsPreview') return block
      return {
        ...block,
        includePast: true,
      }
    })
  : page.layout

const updated = await payload.update({
  collection: 'pages',
  id: page.id,
  data: {
    hero: {
      ...page.hero,
      richText: buildHeroRichText(),
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Upcoming Shows',
            url: '/shows',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Listen to Music',
            url: '/music',
          },
        },
      ],
    },
    layout: updatedLayout,
    _status: 'published',
  },
  context: {
    disableRevalidate: true,
  },
  overrideAccess: true,
})

fs.mkdirSync('tmp', { recursive: true })
fs.writeFileSync('tmp/home-hero-update.json', JSON.stringify(updated?.hero, null, 2))
console.log('Updated home hero copy and CTAs.')

await payload.destroy()
