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
import { BandsintownWidget } from '@/components/BandsintownWidget'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ShowsPage() {
  const { isEnabled: draft } = await draftMode()

  const page = await queryPageBySlug({ draft, slug: 'shows' })

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/shows" />

      {draft && <LivePreviewListener />}

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      <div className="container mt-12">
        {!page?.hero && (
          <div className="prose dark:prose-invert max-w-none">
            <h1>Shows</h1>
          </div>
        )}
      </div>

      <section className="container mt-8">
        <div className="prose dark:prose-invert max-w-none mb-6">
          <h2>Upcoming Shows</h2>
          <p>Live dates are synced from Bandsintown for both TEB and Travis solo shows.</p>
        </div>
        <div className="grid gap-8">
          <div>
            <h3 className="text-lg font-semibold">Travis Ehrenstrom Band (TEB)</h3>
            <BandsintownWidget
              artistId="10521936"
              artistName="Travis Ehrenstrom Band"
              className="mt-4"
              displayLimit={50}
              showPastDates
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Travis Ehrenstrom (Solo)</h3>
            <BandsintownWidget
              artistId="2359898"
              artistName="Travis Ehrenstrom"
              className="mt-4"
              displayLimit={50}
              showPastDates
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Prefer Bandsintown?{' '}
          <a
            className="underline"
            href="https://www.bandsintown.com/a/10521936-travis-ehrenstrom-band"
            rel="noreferrer"
            target="_blank"
          >
            View band dates
          </a>{' '}
          or{' '}
          <a
            className="underline"
            href="https://www.bandsintown.com/a/2359898-travis-ehrenstrom"
            rel="noreferrer"
            target="_blank"
          >
            view solo dates
          </a>
          .
        </p>
      </section>
    </article>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Shows',
  }
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
