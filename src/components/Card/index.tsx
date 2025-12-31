'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group vintage-card vintage-card-hover overflow-hidden cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {/* Image container with vintage treatment */}
      <div className="relative w-full overflow-hidden">
        {!metaImage && (
          <div className="flex aspect-[16/10] items-center justify-center bg-muted text-muted-foreground text-label">
            <span className="opacity-50">No image</span>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* Sepia overlay on hover */}
            <div
              className={cn(
                'absolute inset-0 z-10 pointer-events-none transition-opacity duration-500',
                'bg-gradient-to-br from-amber-900/0 via-transparent to-black/0',
                'group-hover:from-amber-900/15 group-hover:to-black/20',
              )}
            />
            {/* Vignette effect */}
            <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] pointer-events-none" />
            <Media
              resource={metaImage}
              size="33vw"
              imgClassName="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-5">
        {/* Categories as vintage tags */}
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category
                const categoryTitle = titleFromCategory || 'Untitled category'

                return (
                  <span
                    key={index}
                    className={cn(
                      'inline-flex items-center px-2 py-1',
                      'text-label-sm uppercase tracking-stamp-wide',
                      'border border-accent/30 bg-accent/5 text-accent',
                    )}
                  >
                    {categoryTitle}
                  </span>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Title */}
        {titleToUse && (
          <h3 className="font-display text-xl leading-tight tracking-wide">
            <Link
              className="transition-colors duration-200 hover:text-accent"
              href={href}
              ref={link.ref}
            >
              {titleToUse}
            </Link>
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {sanitizedDescription}
          </p>
        )}

        {/* Decorative footer */}
        <div className="mt-4 flex items-center gap-2 text-label-sm text-muted-foreground/60">
          <span className="h-px flex-1 bg-border" />
          <span className="ornament-diamond text-accent/40" />
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>
    </article>
  )
}
