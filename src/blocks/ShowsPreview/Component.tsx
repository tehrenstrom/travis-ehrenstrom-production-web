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
    <section className="container animate-in fade-in slide-in-from-bottom-6 duration-700">
      {(heading || introContent) && (
        <div className="mb-8 max-w-3xl">
          {heading && <h2 className="text-3xl font-semibold md:text-4xl">{heading}</h2>}
          {introContent && (
            <div className="mt-4">
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
