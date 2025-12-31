import React from 'react'

import type { SplitContentBlock as SplitContentBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const SplitContentBlock: React.FC<
  SplitContentBlockProps & {
    id?: string
  }
> = ({ content, ctaLink, heading, layout, media }) => {
  const mediaFirst = layout !== 'mediaRight'

  return (
    <section className="container">
      <div
        className={cn(
          'vintage-card p-6 md:p-10',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Content side */}
          <div className={cn({ 'lg:order-2': !mediaFirst })}>
            {heading && (
              <h2 className="font-display text-display-sm md:text-display-md">
                {heading}
              </h2>
            )}
            {content && (
              <div className="mt-4 text-muted-foreground">
                <RichText data={content} enableGutter={false} enableProse={false} />
              </div>
            )}
            {ctaLink?.url && (
              <div className="mt-6">
                <CMSLink appearance="default" size="lg" {...ctaLink} />
              </div>
            )}
          </div>

          {/* Media side */}
          <div className={cn({ 'lg:order-1': !mediaFirst })}>
            {media && typeof media === 'object' && (
              <div className="corners-poster">
                <div className="relative aspect-[4/3] overflow-hidden frame-vintage">
                  {/* Vintage overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/10 via-transparent to-black/15 pointer-events-none" />
                  <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] pointer-events-none" />
                  <Media
                    fill
                    imgClassName="object-cover"
                    videoClassName="h-full w-full object-cover"
                    resource={media}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
