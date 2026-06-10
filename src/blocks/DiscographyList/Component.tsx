import React from 'react'
import Link from 'next/link'

import type {
  DiscographyListBlock as DiscographyListBlockProps,
  Media as MediaType,
} from '@/payload-types'

import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface ReleaseItem {
  title: string
  year?: string | null
  link?: string | null
  cover?: MediaType | null
  type?: string | null
}

export const DiscographyListBlock: React.FC<DiscographyListBlockProps> = async ({
  heading,
  subheading,
  populateBy,
  releases: manualReleases,
  maxReleases,
  showLink = true,
}) => {
  let releases: ReleaseItem[] = []

  if (populateBy === 'collection') {
    // Fetch from Releases collection
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'releases',
      limit: maxReleases ?? 20,
      sort: '-releaseDate',
      select: {
        title: true,
        slug: true,
        releaseDate: true,
        coverArt: true,
        project: true,
      },
    })

    releases = result.docs.map((doc) => ({
      title: doc.title,
      year: doc.releaseDate ? new Date(doc.releaseDate).getFullYear().toString() : null,
      link: `/music/${doc.slug}`,
      cover: doc.coverArt && typeof doc.coverArt === 'object' ? doc.coverArt : null,
      type: doc.project === 'teb' ? 'TEB' : doc.project === 'travis' ? 'Solo' : null,
    }))
  } else if (manualReleases && manualReleases.length > 0) {
    releases = manualReleases.map((r) => ({
      title: r.title,
      year: r.year,
      link: r.link,
    }))
  }

  if (releases.length === 0) {
    return null
  }

  return (
    <section className="container my-16">
      {/* Header */}
      {(heading || subheading) && (
        <div className="mb-8">
          {subheading && (
            <p className="mb-3 font-mono text-label uppercase text-primary">{subheading}</p>
          )}
          {heading && (
            <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
              {heading}
            </h2>
          )}
        </div>
      )}

      {/* Release grid */}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {releases.map((release, index) => {
          const card = (
            <>
              <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-secondary">
                {release.cover ? (
                  <Media
                    fill
                    imgClassName="object-cover transition duration-base ease-teb-out group-hover:brightness-105"
                    resource={release.cover}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" aria-hidden>
                    <span className="font-display text-display-md font-extrabold text-muted-foreground/40">
                      {release.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-bold leading-tight">{release.title}</span>
                {(release.year || release.type) && (
                  <span className="shrink-0 font-mono text-2xs uppercase tracking-label text-muted-foreground">
                    {[release.type, release.year].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
            </>
          )

          return (
            <li key={index}>
              {release.link ? (
                release.link.startsWith('/') ? (
                  <Link href={release.link} className="group block">
                    {card}
                  </Link>
                ) : (
                  <a
                    href={release.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    {card}
                  </a>
                )
              ) : (
                <div className="group">{card}</div>
              )}
            </li>
          )
        })}
      </ul>

      {/* Link to full music page */}
      {showLink && (
        <div className="mt-8">
          <Link
            href="/music"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-fast ease-teb-out hover:text-clay-600"
          >
            <span>View full discography</span>
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  )
}
