import React from 'react'

import type { DocumentaryTimelineBlock as DocumentaryTimelineBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type TimelineItem = NonNullable<DocumentaryTimelineBlockProps['timeline']>[number]

const accentStyles = {
  ember: {
    badge: 'bg-clay-500/15 text-clay-600 dark:text-clay-300',
    dot: 'bg-clay-500',
  },
  sage: {
    badge: 'bg-moss-500/15 text-moss-600 dark:text-moss-300',
    dot: 'bg-moss-500',
  },
  coast: {
    badge: 'bg-denim-500/15 text-denim-600 dark:text-denim-300',
    dot: 'bg-denim-500',
  },
  sunrise: {
    badge: 'bg-gold-500/15 text-gold-600 dark:text-gold-300',
    dot: 'bg-gold-500',
  },
  midnight: {
    badge: 'bg-secondary text-muted-foreground',
    dot: 'bg-sepia-500',
  },
} as const

type AccentKey = keyof typeof accentStyles

const getAccentStyles = (accent: TimelineItem['accent']) => {
  if (accent && accent in accentStyles) {
    return accentStyles[accent as AccentKey]
  }
  return accentStyles.ember
}

export const DocumentaryTimelineBlock: React.FC<DocumentaryTimelineBlockProps> = ({
  eyebrow,
  title,
  intro,
  timeline,
}) => {
  const hasTimeline = Array.isArray(timeline) && timeline.length > 0
  const runtimeLabel =
    hasTimeline && timeline[0]?.period && timeline[timeline.length - 1]?.period
      ? `${timeline[0].period} – ${timeline[timeline.length - 1].period}`
      : null

  return (
    <section className="container">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="mb-3 font-mono text-label uppercase text-primary">{eyebrow}</p>}
          {title && (
            <h1 className="font-display font-extrabold tracking-display text-display-md md:text-display-lg">
              {title}
            </h1>
          )}
        </div>
        {runtimeLabel && (
          <p className="font-mono text-label-sm uppercase text-muted-foreground">
            Runtime: {runtimeLabel}
          </p>
        )}
      </div>

      {intro && (
        <div className="mt-6 max-w-3xl text-lg text-muted-foreground">
          <RichText data={intro} enableGutter={false} enableProse={false} />
        </div>
      )}

      {/* Divider */}
      <div className="my-10 h-px bg-border" />

      {/* Timeline */}
      {hasTimeline && (
        <ol className="relative space-y-10">
          {/* Timeline line */}
          <span
            aria-hidden
            className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-border sm:block lg:left-1/2 lg:-translate-x-1/2"
          />

          {timeline.map((item, index) => {
            const accent = getAccentStyles(item.accent)
            const isEven = index % 2 === 0
            const cardColumn = isEven
              ? 'lg:col-span-5 lg:col-start-1 lg:pr-10'
              : 'lg:col-span-5 lg:col-start-8 lg:pl-10'

            return (
              <li className="relative grid grid-cols-1 gap-6 lg:grid-cols-12" key={item.id || index}>
                {/* Timeline dot */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-4 top-8 hidden h-3 w-3 rounded-full border-2 border-card sm:block lg:left-1/2 lg:-translate-x-1/2',
                    accent.dot,
                  )}
                />

                {/* Card */}
                <div className={cn('pl-10 sm:pl-12 lg:pl-0', cardColumn)}>
                  <div
                    className={cn(
                      'rounded-md border border-border bg-card p-6',
                      'transition-colors duration-base ease-teb-out hover:border-foreground/35',
                      'opacity-0 animate-fade-up',
                    )}
                    style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    {/* Meta badges */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide',
                          accent.badge,
                        )}
                      >
                        {item.tagline || `Episode ${String(index + 1).padStart(2, '0')}`}
                      </span>
                      {item.period && (
                        <span className="font-mono text-label-sm uppercase text-muted-foreground">
                          {item.period}
                        </span>
                      )}
                      {item.location && (
                        <span className="text-label-sm text-muted-foreground/60">
                          • {item.location}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    {item.chapter && (
                      <h3 className="font-display font-extrabold tracking-display text-display-sm">
                        {item.chapter}
                      </h3>
                    )}
                    {item.release && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Key release: <span className="font-semibold">{item.release}</span>
                      </p>
                    )}

                    {/* Summary */}
                    {item.summary && (
                      <div className="mt-4 text-muted-foreground">
                        <RichText data={item.summary} enableGutter={false} enableProse={false} />
                      </div>
                    )}

                    {/* Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {item.highlights.map((highlight, highlightIndex) => (
                          <li
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                            key={highlight.id || highlightIndex}
                          >
                            <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', accent.dot)} />
                            <span>{highlight.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Quote */}
                    {item.quote?.text && (
                      <blockquote className="mt-6 border-l-stamp border-primary pl-5 italic text-muted-foreground">
                        <p>&ldquo;{item.quote.text}&rdquo;</p>
                        {item.quote.attribution && (
                          <cite className="mt-2 block font-mono text-2xs uppercase tracking-label text-muted-foreground not-italic">
                            — {item.quote.attribution}
                          </cite>
                        )}
                      </blockquote>
                    )}

                    {/* Media */}
                    {item.media && typeof item.media === 'object' && (
                      <div className="mt-6">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border">
                          <Media
                            fill
                            imgClassName="object-cover"
                            videoClassName="h-full w-full object-cover"
                            resource={item.media}
                          />
                        </div>
                      </div>
                    )}

                    {/* Link Button */}
                    {item.enableLink && item.link && (
                      <div className="mt-6 border-t border-border pt-4">
                        <CMSLink
                          {...item.link}
                          appearance={item.link.appearance === 'outline' ? 'outline' : 'default'}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
