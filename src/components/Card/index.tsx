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
        'group organic-card organic-card-hover overflow-hidden cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      {/* Image container with warm organic treatment */}
      <div className="relative w-full overflow-hidden rounded-t-2xl">
        {!metaImage && (
          <div className="flex aspect-[16/10] items-center justify-center bg-secondary/50 text-muted-foreground">
            <span className="opacity-50">✿ No image</span>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="relative aspect-[16/10] overflow-hidden">
            {/* Warm golden overlay on hover */}
            <div
              className={cn(
                'absolute inset-0 z-10 pointer-events-none transition-opacity duration-500',
                'bg-gradient-to-br from-amber-500/0 via-transparent to-emerald-900/0',
                'group-hover:from-amber-500/10 group-hover:to-emerald-900/15',
              )}
            />
            <Media
              resource={metaImage}
              size="33vw"
              imgClassName="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Categories as soft organic tags */}
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
                      'inline-flex items-center px-3 py-1 rounded-full',
                      'text-xs font-medium tracking-wide',
                      'bg-accent/10 text-accent border border-accent/20',
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
          <h3 className="font-display text-xl leading-snug">
            <Link
              className="transition-colors duration-300 hover:text-accent"
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

        {/* Organic decorative footer */}
        <div className="mt-5 flex items-center justify-center gap-3 text-accent/40">
          <span className="text-sm">✦</span>
        </div>
      </div>
    </article>
  )
}
