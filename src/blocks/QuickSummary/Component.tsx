import React from 'react'

import type { QuickSummaryBlock as QuickSummaryBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

type SummaryItem = {
  label: string
  value: string
}

export const QuickSummaryBlock: React.FC<QuickSummaryBlockProps> = ({
  eyebrow,
  title,
  who,
  what,
  where,
  when,
  why,
}) => {
  // Build array of items that have values
  const items: SummaryItem[] = [
    { label: 'Who', value: who || '' },
    { label: 'What', value: what || '' },
    { label: 'Where', value: where || '' },
    { label: 'When', value: when || '' },
    { label: 'Why', value: why || '' },
  ].filter((item) => item.value)

  // Don't render if no items
  if (items.length === 0 && !title) {
    return null
  }

  return (
    <section className="container">
      <div
        className={cn(
          'vintage-card p-6 md:p-10',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(eyebrow || title) && (
          <div className="text-center mb-6">
            {eyebrow && (
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/30" />
                <span className="ornament-star text-accent/60" />
                <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                  {eyebrow}
                </span>
                <span className="ornament-star text-accent/60" />
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/30" />
              </div>
            )}
            {title && (
              <h2 className="font-display text-display-sm md:text-display-md">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Compact flowing items */}
        {items.length > 0 && (
          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-x-1 gap-y-2',
              'text-base md:text-lg text-muted-foreground leading-relaxed',
              'opacity-0 animate-fade-up',
            )}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {items.map((item, index) => (
              <React.Fragment key={item.label}>
                {/* Separator between items */}
                {index > 0 && (
                  <span className="ornament-diamond text-accent/40 mx-2" />
                )}
                {/* Label + Value */}
                <span className="inline-flex items-center gap-2">
                  <span className="text-label-sm uppercase tracking-stamp text-accent/70 font-medium">
                    {item.label}
                  </span>
                  <span className="text-foreground/80">{item.value}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Decorative bottom accent */}
        <div className="flex items-center justify-center mt-6">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="ornament-diamond mx-3 text-accent/30" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </section>
  )
}

