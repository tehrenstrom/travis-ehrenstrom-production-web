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
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 rounded-[32px] border border-foreground/10 bg-card/80 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.5)] backdrop-blur md:p-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className={cn({ 'lg:order-2': !mediaFirst })}>
            {heading && <h2 className="text-3xl font-semibold md:text-4xl">{heading}</h2>}
            {content && (
              <div className="mt-4">
                <RichText data={content} enableGutter={false} />
              </div>
            )}
            {ctaLink?.url && (
              <div className="mt-6">
                <CMSLink appearance="default" size="lg" {...ctaLink} />
              </div>
            )}
          </div>
          <div className={cn({ 'lg:order-1': !mediaFirst })}>
            {media && typeof media === 'object' && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-border bg-background/60 shadow-2xl">
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
