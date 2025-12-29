import React from 'react'

import type { SplitContentBlock } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const SplitContentBlock: React.FC<
  SplitContentBlock & {
    id?: string
  }
> = ({ content, ctaLink, heading, layout, media }) => {
  const mediaFirst = layout !== 'mediaRight'

  return (
    <section className="container">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className={cn({ 'lg:order-2': !mediaFirst })}>
          {heading && <h2 className="text-3xl font-semibold">{heading}</h2>}
          {content && (
            <div className="mt-4">
              <RichText data={content} enableGutter={false} />
            </div>
          )}
          {ctaLink?.url && (
            <div className="mt-6">
              <CMSLink {...ctaLink} />
            </div>
          )}
        </div>
        <div className={cn({ 'lg:order-1': !mediaFirst })}>
          {media && typeof media === 'object' && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
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
    </section>
  )
}
