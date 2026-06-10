'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

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
        'group cursor-pointer overflow-hidden rounded-md border border-border bg-card',
        'transition-colors duration-base ease-teb-out hover:bg-secondary hover:border-foreground/35',
        className,
      )}
      ref={card.ref}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden">
        {!metaImage && (
          <div className="flex aspect-[16/10] items-center justify-center bg-secondary text-muted-foreground">
            <span className="font-mono text-2xs uppercase tracking-label">No image</span>
          </div>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Media resource={metaImage} size="33vw" imgClassName="object-cover w-full h-full" />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Category meta */}
        {showCategories && hasCategories && (
          <p className="mb-3 font-mono text-2xs uppercase tracking-label text-muted-foreground">
            {categories
              ?.map((category) =>
                typeof category === 'object' ? category.title || 'Untitled category' : null,
              )
              .filter(Boolean)
              .join(' / ')}
          </p>
        )}

        {/* Title */}
        {titleToUse && (
          <h3 className="font-display text-xl font-extrabold tracking-display leading-snug">
            <Link
              className="transition-colors duration-fast ease-teb-out hover:text-primary"
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
      </div>
    </article>
  )
}
