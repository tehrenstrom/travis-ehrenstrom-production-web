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
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'
import { cn } from '@/utilities/ui'
import { buttonVariants } from '@/components/ui/button'

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
      <StructuredData doc={page} />

      {Boolean(page?.hero?.type && page.hero.type !== 'none') && page?.hero && (
        <RenderHero {...page.hero} />
      )}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      {/* Page header (hero type 'none' means "no hero" — use the built-in head) */}
      <div className="container mt-12">
        {!(page?.hero?.type && page.hero.type !== 'none') && (
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-label uppercase text-primary">Official merch</p>
            <h1 className="font-display font-extrabold tracking-display text-display-lg md:text-display-xl">
              TEB Store
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Shirts, records, and gear to support the band. Made with love in Bend, Oregon.
            </p>
          </div>
        )}
      </div>

      {/* Products grid */}
      <section className="container mt-10">
        {products.docs.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-10 text-center">
            <p className="font-mono text-label uppercase text-primary">Store</p>
            <h2 className="mt-4 font-display font-extrabold tracking-display text-display-sm">
              Coming soon
            </h2>
            <p className="mt-3 text-muted-foreground">
              CDs and merch are on the way. In the meantime, grab the music on Bandcamp.
            </p>
            <div className="mt-6">
              <a
                className={buttonVariants({ size: 'default', variant: 'default' })}
                href="https://travisehrenstrom.bandcamp.com"
                rel="noreferrer"
                target="_blank"
              >
                Listen on Bandcamp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.docs.map((product, index) => {
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
                <article
                  className={cn(
                    'group overflow-hidden rounded-md border border-border bg-card',
                    'transition-colors duration-base ease-teb-out hover:bg-secondary hover:border-foreground/35',
                    'opacity-0 animate-fade-up',
                  )}
                  key={product.id}
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Product image */}
                  {firstImage && typeof firstImage !== 'string' && (
                    <div className="relative aspect-square w-full overflow-hidden border-b border-border">
                      <Media fill imgClassName="object-cover" resource={firstImage} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="font-display text-xl">
                      <Link
                        className="transition-colors duration-fast ease-teb-out hover:text-primary"
                        href={`/store/${product.slug}`}
                      >
                        {product.title}
                      </Link>
                    </h3>

                    {/* Price */}
                    {price && <p className="mt-2 font-mono text-lg text-primary">{price}</p>}

                    {/* Buy button */}
                    {product.purchaseUrl && (
                      <div className="mt-4">
                        <a
                          className={buttonVariants({ size: 'default', variant: 'outline' })}
                          href={product.purchaseUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Buy now
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="container mt-14">
        <div className="rounded-md border border-border bg-card p-8 text-center">
          <p className="mb-3 font-mono text-label uppercase text-primary">Need a hand</p>
          <p className="text-muted-foreground">
            Questions about orders or custom requests?{' '}
            <a
              href="mailto:travisehrenstrom@gmail.com"
              className="text-primary underline underline-offset-4 transition-colors duration-fast ease-teb-out hover:text-primary/80"
            >
              Get in touch
            </a>
          </p>
        </div>
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
        equals: 'store',
      },
    },
  })

  return generateMeta({
    doc: result.docs?.[0] || null,
    fallbackTitle: 'Store',
    fallbackDescription: 'Official merch and music from Travis Ehrenstrom Band (TEB).',
    path: '/store',
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
