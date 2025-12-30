import React from 'react'

import type { ShowsPreviewBlock as ShowsPreviewBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { BandsintownWidget } from '@/components/BandsintownWidget'

export const ShowsPreviewBlock: React.FC<
  ShowsPreviewBlockProps & {
    id?: string
  }
> = ({ ctaLink, heading, introContent }) => {
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

      <BandsintownWidget className="mt-6" />

      {ctaLink?.url && (
        <div className="mt-8">
          <CMSLink appearance="outline" size="lg" {...ctaLink} />
        </div>
      )}
    </section>
  )
}
