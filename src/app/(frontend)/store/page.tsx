import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React, { cache } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function StorePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const page = await queryPageBySlug({ draft, slug: 'store' })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    draft,
    limit: 200,
    overrideAccess: draft,
    sort: '-createdAt',
  })

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url="/store" />

      {draft && <LivePreviewListener />}

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      <div className="container mt-12">
        {!page?.hero && (
          <div className="prose dark:prose-invert max-w-none">
            <h1>Store</h1>
          </div>
        )}
      </div>

      <section className="container mt-8">
        {products.docs.length === 0 && <p>No products yet.</p>}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.docs.map((product) => {
            const price =
              typeof product.price === 'number'
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: product.currency || 'USD',
                  }).format(product.price)
                : null

            const firstImage =
              product.images && product.images.length > 0 ? product.images[0] : undefined

            return (
              <article className="border border-border rounded-lg overflow-hidden" key={product.id}>
                {firstImage && typeof firstImage !== 'string' && (
                  <div className="relative aspect-square w-full">
                    <Media fill imgClassName="object-cover" resource={firstImage} />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold">
                    <Link href={`/store/${product.slug}`}>{product.title}</Link>
                  </h3>
                  {price && <p className="mt-2 text-muted-foreground">{price}</p>}
                  {product.purchaseUrl && (
                    <a
                      className="mt-4 inline-flex items-center text-sm font-medium underline"
                      href={product.purchaseUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Buy now
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </article>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Store',
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
