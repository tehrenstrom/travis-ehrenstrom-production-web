import React from 'react'

import type { ShowsPreviewBlock as ShowsPreviewBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { BandsintownWidget } from '@/components/BandsintownWidget'

export const ShowsPreviewBlock: React.FC<
  ShowsPreviewBlockProps & {
    id?: string
  }
> = ({ ctaLink, heading, includePast, introContent, limit, project }) => {
  const displayLimit = limit || 6
  const showBand = !project || project === 'all' || project === 'teb'
  const showSolo = !project || project === 'all' || project === 'travis'

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

      <div className="grid gap-8">
        {showBand && (
          <div>
            <h3 className="text-lg font-semibold">Travis Ehrenstrom Band (TEB)</h3>
            <BandsintownWidget
              artistId="10521936"
              artistName="Travis Ehrenstrom Band"
              className="mt-4"
              displayLimit={displayLimit}
              showPastDates={Boolean(includePast)}
            />
          </div>
        )}
        {showSolo && (
          <div>
            <h3 className="text-lg font-semibold">Travis Ehrenstrom (Solo)</h3>
            <BandsintownWidget
              artistId="2359898"
              artistName="Travis Ehrenstrom"
              className="mt-4"
              displayLimit={displayLimit}
              showPastDates={Boolean(includePast)}
            />
          </div>
        )}
      </div>

      {ctaLink?.url && (
        <div className="mt-8">
          <CMSLink appearance="outline" size="lg" {...ctaLink} />
        </div>
      )}
    </section>
  )
}
