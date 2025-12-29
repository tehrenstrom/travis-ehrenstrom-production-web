import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="">
      <div className="container mb-10 pt-16">
        {richText && (
          <RichText
            className="mb-6 max-w-3xl prose-h1:text-4xl md:prose-h1:text-5xl"
            data={richText}
            enableGutter={false}
          />
        )}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex flex-wrap gap-4">
            {links.map(({ link }, i) => {
              const isPrimary = i === 0
              return (
                <li key={i}>
                  <CMSLink appearance={isPrimary ? 'default' : 'outline'} size="lg" {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container ">
        {media && typeof media === 'object' && (
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-card shadow-xl">
            <Media className="h-full w-full" imgClassName="object-cover" priority resource={media} />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
