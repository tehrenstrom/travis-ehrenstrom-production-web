import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from '../../[slug]/page.client'

/**
 * Solo press kit. Pages-collection slugs are single-segment, so this dedicated
 * route renders the `booking-solo` page doc at its canonical nested URL
 * (see src/utilities/pageSlugToPath.ts).
 */

const PAGE_SLUG = 'booking-solo'
const PAGE_PATH = '/booking/solo'

export default async function BookingSoloPage() {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPage()

  if (!page) {
    return <PayloadRedirects url={PAGE_PATH} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={PAGE_PATH} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPage()
  return generateMeta({ doc: page, path: PAGE_PATH })
}

const queryPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: PAGE_SLUG,
      },
    },
  })

  return result.docs?.[0] || null
})
