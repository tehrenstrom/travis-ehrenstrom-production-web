import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Phase 1: make list capture the primary home-hero action.
 *
 *  - Primary CTA  -> "Join the list" (/mailing-list)
 *  - Secondary    -> "Upcoming shows" (/shows)
 *  - Positioning line covers BOTH acts (Travis solo + TEB), plus a one-line list promise.
 *
 * Mirrors src/endpoints/seed/home.ts (the source of truth). Idempotent — only touches
 * the hero; media and layout blocks are preserved. Run: pnpm tsx scripts/update-home-hero-cta.ts
 */

const textNode = (text: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const heading = (text: string, tag: 'h1' | 'h4') => ({
  type: 'heading' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heroRichText = () => ({
  root: {
    type: 'root' as const,
    children: [
      heading('Central Oregon • Jam-Rock Americana', 'h4'),
      heading('Travis Ehrenstrom & TEB', 'h1'),
      paragraph(
        'Pacific Northwest Americana from Central Oregon — intimate solo songs and full-band jam-rock.',
      ),
      paragraph('Join the list for the first word on new songs and shows. No spam.'),
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const run = async () => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'pages',
      limit: 1,
      pagination: false,
      overrideAccess: true,
      where: { slug: { equals: 'home' } },
    })

    const page = result.docs?.[0]
    if (!page) {
      console.error('Home page not found.')
      process.exit(1)
    }

    await payload.update({
      collection: 'pages',
      id: page.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        _status: 'published',
        hero: {
          ...page.hero,
          richText: heroRichText(),
          links: [
            {
              link: {
                type: 'custom',
                appearance: 'default',
                label: 'Join the list',
                url: '/mailing-list',
              },
            },
            {
              link: {
                type: 'custom',
                appearance: 'outline',
                label: 'Upcoming shows',
                url: '/shows',
              },
            },
          ],
        },
      },
    })

    console.log('✅ Home hero updated: primary CTA is now "Join the list".')
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Home hero update failed:', error)
  process.exit(1)
})
