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
  const shows = await payload.find({
    collection: 'shows',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return shows.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ShowPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/shows/' + decodedSlug
  const show = await queryShowBySlug({ draft, slug: decodedSlug })

  if (!show) return <PayloadRedirects url={url} />

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const dateLabel = show.date ? formatter.format(new Date(show.date)) : ''
  const locationParts = [
    show.venue,
    show.location?.city,
    show.location?.region,
    show.location?.country,
  ]
    .filter(Boolean)
    .join(' • ')

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <StructuredData doc={show} type="Event" />

      <div className="container">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{show.title}</h1>
        </div>
        {dateLabel && <p className="mt-2 text-muted-foreground">{dateLabel}</p>}
        {locationParts && <p className="text-muted-foreground">{locationParts}</p>}
        {show.ticketUrl && (
          <a
            className="mt-4 inline-flex items-center text-sm font-medium underline"
            href={show.ticketUrl}
            rel="noreferrer"
            target="_blank"
          >
            Tickets
          </a>
        )}
      </div>

      {show.flyer && typeof show.flyer !== 'string' && (
        <div className="container mt-10">
          <Media resource={show.flyer} />
        </div>
      )}

      {show.details && (
        <div className="container mt-10">
          <RichText data={show.details} />
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const show = await queryShowBySlug({ draft: false, slug: decodedSlug })

  return generateMeta({ doc: show })
}

const queryShowBySlug = cache(async ({ draft, slug }: { draft: boolean; slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'shows',
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
