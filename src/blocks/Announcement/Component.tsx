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
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 relative overflow-hidden rounded-[32px] border border-foreground/10 bg-card/80 px-6 py-10 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur md:px-10">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 left-12 h-48 w-48 rounded-full bg-secondary/40 blur-3xl" />
        <div className="relative">
          {eyebrow && (
            <div className="inline-flex items-center rounded-full border border-foreground/10 bg-background/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {eyebrow}
            </div>
          )}
          {heading && <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{heading}</h2>}
          {content && (
            <div className="mt-4 max-w-2xl">
              <RichText data={content} enableGutter={false} />
            </div>
          )}
          {hasLink && (
            <div className="mt-6">
              <CMSLink appearance="default" size="lg" {...link} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
