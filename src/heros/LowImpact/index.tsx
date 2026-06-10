import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      kicker?: null | string
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, kicker, richText }) => {
  return (
    <div className="container py-16">
      <div className="max-w-[52rem]">
        <div
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          {kicker && <p className="mb-4 font-mono text-label uppercase text-primary">{kicker}</p>}
          {children ||
            (richText && (
              <RichText
                className={cn(
                  'prose-h1:text-display-lg md:prose-h1:text-display-xl',
                  'prose-p:text-muted-foreground',
                )}
                data={richText}
                enableGutter={false}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
