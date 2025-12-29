import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React, { cache } from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ShowsPage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const page = await queryPageBySlug({ draft, slug: 'shows' })

  const shows = await payload.find({
    collection: 'shows',
    depth: 1,
    draft,
    limit: 200,
    overrideAccess: draft,
    sort: 'date',
  })

  const now = new Date()
  const upcoming = shows.docs.filter((show) => {
    if (!show.date) return false
    const dateValue = new Date(show.date)
    return !Number.isNaN(dateValue.getTime()) && dateValue >= now
  })
  const past = shows.docs
    .filter((show) => {
      if (!show.date) return false
      const dateValue = new Date(show.date)
      return !Number.isNaN(dateValue.getTime()) && dateValue < now
    })
    .sort((a, b) => {
      const aDate = a.date ? new Date(a.date).getTime() : 0
      const bDate = b.date ? new Date(b.date).getTime() : 0
      return bDate - aDate
    })

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

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
        </div>
        {upcoming.length === 0 && <p>No upcoming shows yet.</p>}
        <div className="grid grid-cols-1 gap-6">
          {upcoming.map((show) => {
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
              <article className="border border-border rounded-lg p-6" key={show.id}>
                <div className="text-sm uppercase tracking-wide text-muted-foreground">
                  {dateLabel}
                </div>
                <h3 className="mt-2 text-2xl font-semibold">
                  <Link href={`/shows/${show.slug}`}>{show.title}</Link>
                </h3>
                {locationParts && <p className="mt-2 text-muted-foreground">{locationParts}</p>}
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
              </article>
            )
          })}
        </div>
      </section>

      {past.length > 0 && (
        <section className="container mt-12">
          <div className="prose dark:prose-invert max-w-none mb-6">
            <h2>Past Shows</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {past.map((show) => {
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
                <article className="border border-border rounded-lg p-6" key={show.id}>
                  <div className="text-sm uppercase tracking-wide text-muted-foreground">
                    {dateLabel}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold">
                    <Link href={`/shows/${show.slug}`}>{show.title}</Link>
                  </h3>
                  {locationParts && <p className="mt-2 text-muted-foreground">{locationParts}</p>}
                </article>
              )
            })}
          </div>
        </section>
      )}
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
