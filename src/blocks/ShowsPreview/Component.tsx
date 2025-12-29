import React from 'react'

import type { ShowsPreviewBlock as ShowsPreviewBlockProps, Show } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import RichText from '@/components/RichText'
import Link from 'next/link'
import { CMSLink } from '@/components/Link'

export const ShowsPreviewBlock: React.FC<
  ShowsPreviewBlockProps & {
    id?: string
  }
> = async ({ ctaLink, heading, introContent, includePast, limit, project }) => {
  const payload = await getPayload({ config: configPromise })

  const now = new Date().toISOString()
  const where: Where = {}

  if (!includePast) {
    where.date = {
      greater_than_equal: now,
    }
  }

  if (project && project !== 'all') {
    where.project = {
      equals: project,
    }
  }

  const results = await payload.find({
    collection: 'shows',
    depth: 1,
    limit: limit || 3,
    where,
    sort: includePast ? '-date' : 'date',
  })

  const shows = results.docs as Show[]
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <section className="container">
      {(heading || introContent) && (
        <div className="mb-8 max-w-3xl">
          {heading && <h2 className="text-3xl font-semibold">{heading}</h2>}
          {introContent && (
            <div className="mt-4">
              <RichText data={introContent} enableGutter={false} />
            </div>
          )}
        </div>
      )}

      {shows.length === 0 && <p>No shows listed yet.</p>}
      <div className="grid grid-cols-1 gap-6">
        {shows.map((show) => {
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
              <div className="text-sm uppercase tracking-wide text-muted-foreground">{dateLabel}</div>
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

      {ctaLink?.url && (
        <div className="mt-8">
          <CMSLink {...ctaLink} />
        </div>
      )}
    </section>
  )
}
