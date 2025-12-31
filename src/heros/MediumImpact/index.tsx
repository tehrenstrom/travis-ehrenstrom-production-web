import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div>
      <div className="container mb-10 pt-16">
        {/* Eyebrow decoration */}
        <div
          className="flex items-center gap-3 mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <span className="ornament-diamond text-accent/60" />
          <span className="h-px w-16 bg-border" />
        </div>

        {richText && (
          <div
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <RichText
              className={cn(
                'mb-6 max-w-3xl',
                'prose-h1:font-display prose-h1:text-display-lg prose-h1:font-normal',
                'md:prose-h1:text-display-xl',
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
              const delay = 300 + i * 100
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

      {/* Media with vintage frame */}
      <div className="container">
        {media && typeof media === 'object' && (
          <div
            className="opacity-0 animate-reveal"
            style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
          >
            <div className="corners-poster">
              <div className="relative overflow-hidden frame-vintage">
                {/* Vintage overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
                <div className="absolute inset-0 z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
                <Media
                  className="h-full w-full"
                  imgClassName="object-cover"
                  priority
                  resource={media}
                />
                {media?.caption && (
                  <div className="mt-4 text-center">
                    <RichText
                      className="text-sm text-muted-foreground"
                      data={media.caption}
                      enableGutter={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
