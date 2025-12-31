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

      {page?.hero && <RenderHero {...page.hero} />}
      {page?.layout && <RenderBlocks blocks={page.layout} />}

      {/* Page header */}
      <div className="container mt-12">
        {!page?.hero && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="ornament-star text-accent/50" />
              <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                Official Merch
              </span>
            </div>
            <h1 className="font-display text-display-lg md:text-display-xl">
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
          <div className="vintage-card p-10 text-center">
            <span className="ornament-diamond text-accent/50" />
            <h2 className="mt-4 font-display text-display-sm">Coming Soon</h2>
            <p className="mt-3 text-muted-foreground">
              New merch dropping soon. Check back for shirts, vinyl, and more.
            </p>
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
                    'group vintage-card vintage-card-hover overflow-hidden',
                    'opacity-0 animate-fade-up',
                  )}
                  key={product.id}
                  style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Product image */}
                  {firstImage && typeof firstImage !== 'string' && (
                    <div className="relative aspect-square w-full overflow-hidden">
                      {/* Sepia overlay on hover */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/0 to-black/0 transition-all duration-500 group-hover:from-amber-900/10 group-hover:to-black/15 pointer-events-none" />
                      <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] pointer-events-none" />
                      <Media
                        fill
                        imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        resource={firstImage}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="font-display text-xl">
                      <Link
                        className="transition-colors duration-200 hover:text-accent"
                        href={`/store/${product.slug}`}
                      >
                        {product.title}
                      </Link>
                    </h3>

                    {/* Price */}
                    {price && (
                      <p className="mt-2 text-lg font-mono text-accent">
                        {price}
                      </p>
                    )}

                    {/* Buy button */}
                    {product.purchaseUrl && (
                      <div className="mt-4">
                        <a
                          className={buttonVariants({ size: 'default', variant: 'outline' })}
                          href={product.purchaseUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Buy Now
                        </a>
                      </div>
                    )}

                    {/* Decorative footer */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-px flex-1 bg-border" />
                      <span className="ornament-diamond text-accent/30" />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="container mt-14">
        <div className="vintage-card p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
            <span className="ornament-star text-accent/50" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
          </div>
          <p className="text-muted-foreground">
            Questions about orders or custom requests?{' '}
            <a
              href="mailto:hello@travisehrenstrom.com"
              className="text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
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
