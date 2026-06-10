import React from 'react'

import type { AnnouncementBlock as AnnouncementBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'

export const AnnouncementBlock: React.FC<
  AnnouncementBlockProps & {
    id?: string
  }
> = ({ content, eyebrow, heading, link }) => {
  const hasLink = link && link.url

  return (
    <div className="container">
      <div className="rounded-md border border-border bg-card px-5 py-4 md:flex md:items-center md:justify-between md:gap-8">
        <div className="min-w-0">
          {eyebrow && (
            <p className="font-mono text-2xs uppercase tracking-label text-primary">{eyebrow}</p>
          )}
          {heading && (
            <h2 className="mt-1 font-display text-lg font-extrabold tracking-display">{heading}</h2>
          )}
          {content && (
            <div className="mt-1 max-w-2xl text-sm text-muted-foreground">
              <RichText data={content} enableGutter={false} />
            </div>
          )}
        </div>
        {hasLink && (
          <div className="mt-4 shrink-0 md:mt-0">
            <CMSLink appearance="default" size="sm" {...link} />
          </div>
        )}
      </div>
    </div>
  )
}
