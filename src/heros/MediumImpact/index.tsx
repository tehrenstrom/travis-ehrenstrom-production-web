import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div>
      {/* Page head */}
      <section className="bg-secondary border-b border-border">
        <div className="container py-16 md:py-20">
          {richText && (
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <RichText
                className={cn(
                  'mb-8 max-w-3xl',
                  'prose-h1:text-display-lg md:prose-h1:text-display-xl',
                  'prose-p:text-muted-foreground prose-p:text-lg',
                )}
                data={richText}
                enableGutter={false}
              />
            </div>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {links.map(({ link }, i) => {
                const isPrimary = i === 0
                const delay = 200 + i * 100
                return (
                  <li
                    key={i}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
                  >
                    <CMSLink appearance={isPrimary ? 'default' : 'outline'} size="lg" {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Media */}
      <div className="container mt-10">
        {media && typeof media === 'object' && (
          <div
            className="opacity-0 animate-reveal"
            style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
          >
            <div className="overflow-hidden rounded-md border border-border">
              <Media
                className="h-full w-full"
                imgClassName="object-cover"
                priority
                resource={media}
              />
            </div>
            {media?.caption && (
              <div className="mt-4">
                <RichText
                  className="text-sm text-muted-foreground"
                  data={media.caption}
                  enableGutter={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
