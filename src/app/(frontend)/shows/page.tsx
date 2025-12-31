import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import PageClient from './page.client'
import { BandsintownCalendar } from '@/components/BandsintownCalendar'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ShowsPage() {
  const { isEnabled: draft } = await draftMode()

  const page = await queryPageBySlug({ draft, slug: 'shows' })

  return (
    <article className="pt-8 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/shows" />

      {draft && <LivePreviewListener />}
      <StructuredData doc={page} />

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      <section className="container">
        <BandsintownCalendar includePast />
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: 'shows',
      },
    },
  })

  return generateMeta({
    doc: result.docs?.[0] || null,
    fallbackTitle: 'Shows',
    fallbackDescription: 'Upcoming and past shows for Travis Ehrenstrom Band (TEB).',
    path: '/shows',
  })
}

const queryPageBySlug = cache(
  async ({ draft, slug }: { draft: boolean; slug: string }): Promise<RequiredDataFromCollectionSlug<'pages'> | null> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  },
)
