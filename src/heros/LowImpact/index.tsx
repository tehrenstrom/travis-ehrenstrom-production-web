import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-20">
      <div className="max-w-[52rem]">
        {/* Decorative eyebrow */}
        <div
          className="flex items-center gap-3 mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <span className="ornament-star text-accent/50" />
          <span className="h-px w-12 bg-border" />
        </div>

        {/* Content */}
        <div
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          {children ||
            (richText && (
              <RichText
                className={cn(
                  'prose-h1:font-display prose-h1:text-display-lg prose-h1:font-normal',
                  'md:prose-h1:text-display-xl',
                  'prose-p:text-muted-foreground',
                )}
                data={richText}
                enableGutter={false}
              />
            ))}
        </div>

        {/* Decorative divider below */}
        <div
          className="flex items-center gap-4 mt-8 opacity-0 animate-fade-up"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
        >
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          <span className="ornament-diamond text-accent/40" />
        </div>
      </div>
    </div>
  )
}
