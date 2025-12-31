import React from 'react'

import type { DocumentaryTimelineBlock as DocumentaryTimelineBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

type TimelineItem = NonNullable<DocumentaryTimelineBlockProps['timeline']>[number]

const accentStyles = {
  ember: {
    badge: 'border-amber-600/40 bg-amber-100/80 text-amber-900 dark:border-amber-400/30 dark:bg-amber-900/30 dark:text-amber-200',
    dot: 'bg-amber-500',
    card: 'border-amber-400/60 dark:border-amber-600/40',
    cardGlow: 'hover:border-amber-500/70 hover:shadow-[0_0_20px_hsl(32_95%_50%/0.12)]',
  },
  sage: {
    badge: 'border-emerald-600/40 bg-emerald-100/80 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-900/30 dark:text-emerald-200',
    dot: 'bg-emerald-500',
    card: 'border-emerald-400/60 dark:border-emerald-600/40',
    cardGlow: 'hover:border-emerald-500/70 hover:shadow-[0_0_20px_hsl(155_45%_45%/0.12)]',
  },
  coast: {
    badge: 'border-sky-600/40 bg-sky-100/80 text-sky-900 dark:border-sky-400/30 dark:bg-sky-900/30 dark:text-sky-200',
    dot: 'bg-sky-500',
    card: 'border-sky-400/60 dark:border-sky-600/40',
    cardGlow: 'hover:border-sky-500/70 hover:shadow-[0_0_20px_hsl(195_70%_50%/0.12)]',
  },
  sunrise: {
    badge: 'border-orange-600/40 bg-orange-100/80 text-orange-900 dark:border-orange-400/30 dark:bg-orange-900/30 dark:text-orange-200',
    dot: 'bg-orange-500',
    card: 'border-orange-400/60 dark:border-orange-600/40',
    cardGlow: 'hover:border-orange-500/70 hover:shadow-[0_0_20px_hsl(25_90%_50%/0.12)]',
  },
  midnight: {
    badge: 'border-slate-600/40 bg-slate-100/80 text-slate-900 dark:border-slate-400/30 dark:bg-slate-900/30 dark:text-slate-200',
    dot: 'bg-slate-500',
    card: 'border-slate-400/60 dark:border-slate-500/40',
    cardGlow: 'hover:border-slate-500/60 hover:shadow-[0_0_20px_hsl(220_15%_40%/0.12)]',
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
      <div
        className={cn(
          'vintage-card p-6 md:p-12',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-label uppercase tracking-stamp-wide text-muted-foreground mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h1 className="font-display text-display-md md:text-display-lg">
                {title}
              </h1>
            )}
          </div>
          {runtimeLabel && (
            <div className="flex items-center gap-3 text-label-sm uppercase tracking-stamp text-muted-foreground">
              <span className="ornament-diamond text-accent/50" />
              <span>Runtime: {runtimeLabel}</span>
            </div>
          )}
        </div>

        {intro && (
          <div className="mt-6 max-w-3xl text-lg text-muted-foreground">
            <RichText data={intro} enableGutter={false} enableProse={false} />
          </div>
        )}

        {/* Decorative divider */}
        <div className="flex items-center justify-center my-10">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
          <span className="ornament-star mx-4 text-accent/50" />
          <span className="h-px flex-1 bg-border" />
          <span className="ornament-star mx-4 text-accent/50" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
        </div>

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
                      'absolute left-4 top-8 hidden h-3 w-3 rounded-full border-2 border-card shadow sm:block lg:left-1/2 lg:-translate-x-1/2',
                      accent.dot,
                    )}
                  />

                  {/* Card */}
                  <div className={cn('pl-10 sm:pl-12 lg:pl-0', cardColumn)}>
                    <div
                      className={cn(
                        'vintage-card p-6 border-2 transition-all duration-300',
                        accent.card,
                        accent.cardGlow,
                        'opacity-0 animate-fade-up',
                      )}
                      style={{ animationDelay: `${200 + index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={cn('px-2 py-1 text-label-sm uppercase tracking-stamp', accent.badge)}>
                          {item.tagline || `Episode ${String(index + 1).padStart(2, '0')}`}
                        </span>
                        {item.period && (
                          <span className="text-label-sm uppercase tracking-stamp text-muted-foreground">
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
                        <h3 className="font-display text-display-sm">
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
                        <blockquote className="mt-6 border-l-2 border-accent/40 pl-4 italic text-muted-foreground">
                          <p>&ldquo;{item.quote.text}&rdquo;</p>
                          {item.quote.attribution && (
                            <cite className="mt-2 block text-label-sm uppercase tracking-stamp text-muted-foreground/60 not-italic">
                              — {item.quote.attribution}
                            </cite>
                          )}
                        </blockquote>
                      )}

                      {/* Media */}
                      {item.media && typeof item.media === 'object' && (
                        <div className="mt-6">
                          <div className="frame-vintage group/media">
                            <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                              {/* Warm vintage overlay */}
                              <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/10 via-transparent to-black/15 pointer-events-none transition-opacity duration-300 group-hover/media:opacity-70" />
                              {/* Subtle grain overlay for vintage feel */}
                              <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')]" />
                              <Media
                                fill
                                imgClassName="object-cover transition-transform duration-500 group-hover/media:scale-105"
                                videoClassName="h-full w-full object-cover"
                                resource={item.media}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Link Button */}
                      {item.enableLink && item.link && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <CMSLink
                            {...item.link}
                            appearance={item.link.appearance === 'outline' ? 'outline' : 'default'}
                            size="sm"
                            className="text-label-sm uppercase tracking-stamp"
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
      </div>
    </section>
  )
}
