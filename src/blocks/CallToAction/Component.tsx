import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div
        className={cn(
          'vintage-card corners-poster p-6 md:p-10',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Decorative top accent */}
        <div className="flex items-center justify-center mb-6">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/30" />
          <span className="ornament-star mx-3 text-accent/60" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/30" />
        </div>

        <div className="md:flex md:items-center md:justify-between md:gap-10">
          {/* Content */}
          <div className="max-w-[48rem]">
            {richText && (
              <RichText
                className={cn(
                  'mb-0 prose-headings:font-display prose-headings:font-normal',
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

        {/* Decorative bottom accent */}
        <div className="flex items-center justify-center mt-6">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/30" />
          <span className="ornament-diamond mx-3 text-accent/40" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/30" />
        </div>
      </div>
    </div>
  )
}
