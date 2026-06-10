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
          'rounded-md border border-border bg-card p-6 md:p-10',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(eyebrow || title) && (
          <div className="text-center mb-6">
            {eyebrow && (
              <p className="font-mono text-label uppercase text-primary mb-3">{eyebrow}</p>
            )}
            {title && (
              <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
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
                  <span aria-hidden="true" className="mx-2 h-1 w-1 rounded-full bg-border" />
                )}
                {/* Label + Value */}
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-label-sm uppercase text-primary">
                    {item.label}
                  </span>
                  <span className="text-foreground/80">{item.value}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
