import React from 'react'

import type { ShowsPreviewBlock as ShowsPreviewBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { BandsintownCalendar } from '@/components/BandsintownCalendar'

export const ShowsPreviewBlock: React.FC<
  ShowsPreviewBlockProps & {
    id?: string
  }
> = ({ ctaLink, heading, includePast, introContent, limit, project }) => {
  const displayLimit = limit || 6
  const defaultArtist =
    project === 'teb' ? 'teb' : project === 'travis' ? 'travis' : 'all'

  return (
    <section
      className="container opacity-0 animate-reveal"
      style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
    >
      {(heading || introContent) && (
        <div className="mb-8 max-w-3xl">
          <p className="font-mono text-label uppercase text-primary mb-3">Live</p>
          {heading && (
            <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
              {heading}
            </h2>
          )}
          {introContent && (
            <div className="mt-4 text-muted-foreground">
              <RichText data={introContent} enableGutter={false} />
            </div>
          )}
        </div>
      )}

      <BandsintownCalendar
        className="mt-4"
        defaultArtist={defaultArtist}
        includePast={Boolean(includePast)}
        limit={displayLimit}
      />

      {ctaLink?.url && (
        <div className="mt-8">
          <CMSLink appearance="outline" size="lg" {...ctaLink} />
        </div>
      )}
    </section>
  )
}
