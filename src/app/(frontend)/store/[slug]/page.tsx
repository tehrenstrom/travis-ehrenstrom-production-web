import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import PageClient from './page.client'
import { generateMeta } from '@/utilities/generateMeta'
import { StructuredData } from '@/components/StructuredData'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return products.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/store/' + decodedSlug
  const product = await queryProductBySlug({ draft, slug: decodedSlug })

  if (!product) return <PayloadRedirects url={url} />

  const price =
    typeof product.price === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: product.currency || 'USD',
        }).format(product.price)
      : null

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <StructuredData doc={product} type="Product" />

      <div className="container">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{product.title}</h1>
        </div>
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

      {product.images && product.images.length > 0 && (
        <div className="container mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {product.images.map((image, index) => {
            if (typeof image === 'string') return null
            return (
              <div className="relative aspect-square w-full" key={`${product.id}-${index}`}>
                <Media fill imgClassName="object-cover" resource={image} />
              </div>
            )
          })}
        </div>
      )}

      {product.description && (
        <div className="container mt-10">
          <RichText data={product.description} />
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const product = await queryProductBySlug({ draft: false, slug: decodedSlug })

  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ draft, slug }: { draft: boolean; slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
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
})
