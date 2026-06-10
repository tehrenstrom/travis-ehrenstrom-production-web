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
          'rounded-md border border-border bg-card p-6 md:p-10',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Content side */}
          <div className={cn({ 'lg:order-2': !mediaFirst })}>
            {heading && (
              <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border">
                <Media
                  fill
                  imgClassName="object-cover"
                  videoClassName="h-full w-full object-cover"
                  resource={media}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
