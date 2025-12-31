import React from 'react'
import Link from 'next/link'

import type { DiscographyListBlock as DiscographyListBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface ReleaseItem {
  title: string
  year?: string | null
  link?: string | null
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
      },
    })

    releases = result.docs.map((doc) => ({
      title: doc.title,
      year: doc.releaseDate ? new Date(doc.releaseDate).getFullYear().toString() : null,
      link: `/music/${doc.slug}`,
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
      <div
        className="vintage-card p-6 md:p-10 opacity-0 animate-reveal"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-8">
            {subheading && (
              <div className="flex items-center gap-3 mb-3">
                <span className="ornament-star text-accent/50" />
                <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                  {subheading}
                </span>
              </div>
            )}
            {heading && (
              <h2 className="font-display text-display-sm md:text-display-md">{heading}</h2>
            )}
          </div>
        )}

        {/* Release list */}
        <ul className="space-y-3">
          {releases.map((release, index) => (
            <li
              key={index}
              className={cn(
                'flex items-center justify-between gap-4 opacity-0 animate-fade-up',
                'py-3 border-b border-border/50 last:border-0',
              )}
              style={{
                animationDelay: `${200 + index * 30}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent/60 shrink-0" />
                {release.link ? (
                  release.link.startsWith('/') ? (
                    <Link
                      href={release.link}
                      className="font-medium hover:text-accent transition-colors"
                    >
                      {release.title}
                    </Link>
                  ) : (
                    <a
                      href={release.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-accent transition-colors"
                    >
                      {release.title}
                    </a>
                  )
                ) : (
                  <span className="font-medium">{release.title}</span>
                )}
              </div>
              {release.year && (
                <span className="text-sm text-muted-foreground shrink-0">{release.year}</span>
              )}
            </li>
          ))}
        </ul>

        {/* Link to full music page */}
        {showLink && (
          <div
            className="mt-8 text-center opacity-0 animate-fade-up"
            style={{
              animationDelay: `${200 + releases.length * 30 + 100}ms`,
              animationFillMode: 'forwards',
            }}
          >
            <Link
              href="/music"
              className={cn(
                'inline-flex items-center gap-2 text-sm text-accent hover:underline',
              )}
            >
              <span>View full discography</span>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

