import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const hasCategories =
    Array.isArray(categories) && categories.some((category) => typeof category === 'object')

  return (
    <div className="container">
      <div className="mx-auto max-w-[48rem]">
        {/* Meta line: categories + date */}
        {(hasCategories || publishedAt) && (
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-2xs uppercase tracking-label text-muted-foreground opacity-0 animate-fade-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    <span>{titleToUse}</span>
                    {!isLast && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                )
              }
              return null
            })}
            {hasCategories && publishedAt && <span aria-hidden="true">·</span>}
            {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
          </div>
        )}

        <div
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <h1 className="mt-4 text-display-md md:text-display-lg text-balance">{title}</h1>

          {hasAuthors && (
            <p className="mt-4 text-sm text-muted-foreground">
              By {formatAuthors(populatedAuthors)}
            </p>
          )}
        </div>
      </div>

      {/* Hero image */}
      {heroImage && typeof heroImage !== 'string' && (
        <div
          className="mx-auto mt-10 max-w-[52rem] opacity-0 animate-reveal"
          style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
        >
          <div className="overflow-hidden rounded-md border border-border">
            <Media className="h-full w-full" imgClassName="object-cover" priority resource={heroImage} />
          </div>
        </div>
      )}
    </div>
  )
}
