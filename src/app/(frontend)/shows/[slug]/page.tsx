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
import { buttonVariants } from '@/components/ui/button'

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

  const showDate = show.date ? new Date(show.date) : null
  const monthLabel = showDate
    ? new Intl.DateTimeFormat(undefined, { month: 'short' }).format(showDate)
    : ''
  const dayLabel = showDate
    ? new Intl.DateTimeFormat(undefined, { day: 'numeric' }).format(showDate)
    : ''
  const weekdayLabel = showDate
    ? new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(showDate)
    : ''
  const timeLabel = showDate
    ? new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(showDate)
    : ''
  const locationParts = [
    show.venue,
    show.location?.city,
    show.location?.region,
    show.location?.country,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <StructuredData doc={show} type="Event" />

      <div className="container">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-label uppercase text-primary">Live show</p>
          <h1 className="font-display font-extrabold tracking-display text-display-lg md:text-display-xl">
            {show.title}
          </h1>
        </div>

        {/* Ticket-style date card */}
        <div className="mt-8 flex max-w-3xl flex-wrap items-center gap-6 rounded-md border border-border bg-card p-5 md:p-6">
          {showDate && (
            <div className="w-20 flex-none border-r border-border pr-6 text-center leading-none">
              <p className="font-mono text-label-sm uppercase text-primary">{monthLabel}</p>
              <p className="mt-1 font-display text-4xl font-extrabold tracking-display">
                {dayLabel}
              </p>
              <p className="mt-1.5 font-mono text-2xs uppercase tracking-label text-muted-foreground">
                {weekdayLabel}
              </p>
            </div>
          )}
          <div className="min-w-0 flex-1">
            {locationParts && <p className="text-lg font-bold leading-snug">{locationParts}</p>}
            {timeLabel && (
              <p className="mt-1 font-mono text-label-sm uppercase text-muted-foreground">
                {timeLabel}
              </p>
            )}
          </div>
          {show.ticketUrl && (
            <a
              className={buttonVariants({ size: 'default', variant: 'default' })}
              href={show.ticketUrl}
              rel="noreferrer"
              target="_blank"
            >
              Tickets
            </a>
          )}
        </div>
      </div>

      {show.flyer && typeof show.flyer !== 'string' && (
        <div className="container mt-10">
          <div className="max-w-3xl overflow-hidden rounded-md border border-border">
            <Media resource={show.flyer} />
          </div>
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
