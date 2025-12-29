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
      <div className="rounded-2xl border border-border bg-card px-6 py-8 md:px-10 md:py-10">
        {eyebrow && (
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</div>
        )}
        {heading && <h2 className="mt-3 text-3xl font-semibold">{heading}</h2>}
        {content && (
          <div className="mt-4">
            <RichText data={content} enableGutter={false} />
          </div>
        )}
        {hasLink && (
          <div className="mt-6">
            <CMSLink {...link} />
          </div>
        )}
      </div>
    </div>
  )
}
