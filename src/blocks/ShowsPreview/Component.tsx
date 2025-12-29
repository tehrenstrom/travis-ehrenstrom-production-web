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
    <section className="container animate-in fade-in slide-in-from-bottom-6 duration-700">
      {(heading || introContent) && (
        <div className="mb-8 max-w-3xl">
          {heading && <h2 className="text-3xl font-semibold md:text-4xl">{heading}</h2>}
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
          const projectLabel =
            show.project === 'teb' ? 'TEB' : show.project === 'travis' ? 'Travis Solo' : null
          const locationParts = [
            show.venue,
            show.location?.city,
            show.location?.region,
            show.location?.country,
          ]
            .filter(Boolean)
            .join(' • ')
          return (
            <article
              className="group rounded-[24px] border border-foreground/10 bg-card/80 p-6 transition hover:-translate-y-1 hover:shadow-[0_22px_50px_-36px_rgba(0,0,0,0.45)]"
              key={show.id}
            >
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {dateLabel && (
                  <span className="rounded-full border border-foreground/10 bg-background/70 px-3 py-1">
                    {dateLabel}
                  </span>
                )}
                {projectLabel && (
                  <span className="rounded-full border border-foreground/10 bg-background/70 px-3 py-1">
                    {projectLabel}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-2xl font-semibold">
                <Link className="transition group-hover:text-foreground" href={`/shows/${show.slug}`}>
                  {show.title}
                </Link>
              </h3>
              {locationParts && <p className="mt-2 text-muted-foreground">{locationParts}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {show.ticketUrl && (
                  <a
                    className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:-translate-y-0.5"
                    href={show.ticketUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Tickets
                  </a>
                )}
                <Link
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
                  href={`/shows/${show.slug}`}
                >
                  Details
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      {ctaLink?.url && (
        <div className="mt-8">
          <CMSLink appearance="outline" size="lg" {...ctaLink} />
        </div>
      )}
    </section>
  )
}
