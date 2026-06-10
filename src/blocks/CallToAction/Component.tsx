import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="rounded-md bg-secondary p-6 md:p-8">
        <div className="md:flex md:items-center md:justify-between md:gap-10">
          {/* Content */}
          <div className="max-w-[48rem]">
            {richText && (
              <RichText
                className={cn(
                  'mb-0 prose-headings:font-display prose-headings:font-extrabold prose-headings:tracking-display',
                  'prose-h2:text-display-sm md:prose-h2:text-display-md',
                  'prose-p:text-muted-foreground',
                )}
                data={richText}
                enableGutter={false}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:shrink-0">
            {(links || []).map(({ link }, i) => {
              const isPrimary = i === 0
              return (
                <CMSLink
                  key={i}
                  appearance={isPrimary ? 'default' : 'outline'}
                  size="lg"
                  {...link}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
