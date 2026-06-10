import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { ChoiceCardsBlock as ChoiceCardsBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const ChoiceCardsBlock: React.FC<ChoiceCardsBlockProps> = ({
  cards,
  heading,
  intro,
  kicker,
}) => {
  if (!cards?.length) return null

  return (
    <section className="container">
      {(kicker || heading || intro) && (
        <div className="mb-10 max-w-2xl">
          {kicker && <p className="font-mono text-label uppercase text-primary">{kicker}</p>}
          {heading && (
            <h2 className="mt-3 font-display text-display-md font-extrabold tracking-display md:text-display-lg">
              {heading}
            </h2>
          )}
          {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
        </div>
      )}

      <div
        className={cn(
          'grid gap-6',
          cards.length === 1 ? 'max-w-xl' : cards.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3',
        )}
      >
        {cards.map((card, i) => {
          const isSolo = card.tag?.toLowerCase().includes('solo')

          return (
            <CMSLink
              key={i}
              {...card.link}
              appearance="inline"
              className={cn(
                'group flex flex-col rounded-md border border-border bg-card p-7',
                'transition-colors duration-base ease-teb-out',
                'hover:bg-secondary hover:border-foreground/35',
              )}
              label={null}
            >
              {card.tag && (
                <span
                  className={cn(
                    'mb-4 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
                    isSolo
                      ? 'bg-denim-500/15 text-denim-600 dark:text-denim-300'
                      : 'bg-clay-500/15 text-clay-600 dark:text-clay-300',
                  )}
                >
                  {card.tag}
                </span>
              )}

              <h3 className="font-display text-xl font-extrabold tracking-display md:text-2xl">
                {card.title}
              </h3>

              {card.body && (
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{card.body}</p>
              )}

              {card.link?.label && (
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {card.link.label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-fast ease-teb-out group-hover:translate-x-0.5" />
                </span>
              )}
            </CMSLink>
          )
        })}
      </div>
    </section>
  )
}
