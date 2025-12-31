import React from 'react'

import type { DocumentaryTimelineBlock as DocumentaryTimelineBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

type TimelineItem = NonNullable<DocumentaryTimelineBlockProps['timeline']>[number]

const accentStyles = {
  ember: {
    badge: 'border-amber-200/70 bg-amber-100/80 text-amber-950',
    dot: 'bg-amber-400',
    card: 'from-amber-200/40 via-card/80 to-card/80 dark:from-amber-500/20',
  },
  sage: {
    badge: 'border-emerald-200/70 bg-emerald-100/80 text-emerald-950',
    dot: 'bg-emerald-400',
    card: 'from-emerald-200/35 via-card/80 to-card/80 dark:from-emerald-500/20',
  },
  coast: {
    badge: 'border-sky-200/70 bg-sky-100/80 text-sky-950',
    dot: 'bg-sky-400',
    card: 'from-sky-200/35 via-card/80 to-card/80 dark:from-sky-500/20',
  },
  sunrise: {
    badge: 'border-orange-200/70 bg-orange-100/80 text-orange-950',
    dot: 'bg-orange-400',
    card: 'from-orange-200/35 via-card/80 to-card/80 dark:from-orange-500/20',
  },
  midnight: {
    badge: 'border-slate-200/70 bg-slate-100/80 text-slate-950',
    dot: 'bg-slate-400',
    card: 'from-slate-200/35 via-card/80 to-card/80 dark:from-slate-500/20',
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
      ? `${timeline[0].period} - ${timeline[timeline.length - 1].period}`
      : null

  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-[36px] border border-foreground/10 bg-card/70 p-6 shadow-[0_30px_80px_-60px_rgba(15,15,15,0.5)] backdrop-blur md:p-12">
        <div className="pointer-events-none absolute -left-32 top-6 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-6 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-[repeating-linear-gradient(135deg,_hsl(var(--foreground)_/_0.12)_0_12px,_transparent_12px_24px)] opacity-60" />

        <div className="relative">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <p className="text-xs font-mono uppercase tracking-[0.35em] text-foreground/60">
                  {eyebrow}
                </p>
              )}
              {title && <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>}
            </div>
            {runtimeLabel && (
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-foreground/60">
                <span className="rounded-full border border-foreground/15 bg-background/70 px-3 py-1">
                  Runtime
                </span>
                <span>{runtimeLabel}</span>
              </div>
            )}
          </div>

          {intro && (
            <div className="mt-6 max-w-3xl text-lg text-foreground/80">
              <RichText data={intro} enableGutter={false} />
            </div>
          )}

          {hasTimeline && (
            <ol className="relative mt-12 space-y-12">
              <span
                aria-hidden
                className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-foreground/15 sm:block lg:left-1/2 lg:-translate-x-1/2"
              />

              {timeline.map((item, index) => {
                const accent = getAccentStyles(item.accent)
                const isEven = index % 2 === 0
                const cardColumn = isEven
                  ? 'lg:col-span-5 lg:col-start-1 lg:pr-10'
                  : 'lg:col-span-5 lg:col-start-8 lg:pl-10'

                return (
                  <li className="relative grid grid-cols-1 gap-6 lg:grid-cols-12" key={item.id || index}>
                    <span
                      aria-hidden
                      className={cn(
                        'absolute left-4 top-10 hidden h-3 w-3 rounded-full border border-background shadow sm:block lg:left-1/2 lg:-translate-x-1/2',
                        accent.dot,
                      )}
                    />
                    <div className={cn('pl-10 sm:pl-12 lg:pl-0', cardColumn)}>
                      <div
                        className={cn(
                          'group relative overflow-hidden rounded-[28px] border border-foreground/10 bg-gradient-to-br p-6 shadow-[0_24px_60px_-48px_rgba(15,15,15,0.45)] backdrop-blur',
                          accent.card,
                          'animate-in fade-in slide-in-from-bottom-6 duration-700',
                        )}
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <div className="flex flex-wrap items-center gap-3 text-[0.65rem] font-mono uppercase tracking-[0.3em] text-foreground/60">
                          <span className={cn('rounded-full border px-3 py-1', accent.badge)}>
                            {item.tagline || `Episode ${String(index + 1).padStart(2, '0')}`}
                          </span>
                          {item.period && <span className="text-foreground/70">{item.period}</span>}
                          {item.location && <span className="text-foreground/50">{item.location}</span>}
                        </div>

                        <div className="mt-4">
                          {item.chapter && <h3 className="text-2xl font-semibold">{item.chapter}</h3>}
                          {item.release && (
                            <p className="mt-2 text-sm text-foreground/70">Key release: {item.release}</p>
                          )}
                        </div>

                        {item.summary && (
                          <div className="mt-4 text-foreground/80">
                            <RichText data={item.summary} enableGutter={false} />
                          </div>
                        )}

                        {item.highlights && item.highlights.length > 0 && (
                          <ul className="mt-4 grid gap-2 text-sm text-foreground/70">
                            {item.highlights.map((highlight, highlightIndex) => (
                              <li
                                className="flex items-start gap-2"
                                key={highlight.id || highlightIndex}
                              >
                                <span className={cn('mt-2 h-1.5 w-1.5 rounded-full', accent.dot)} />
                                <span>{highlight.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {item.quote?.text && (
                          <blockquote className="mt-6 border-l-2 border-foreground/20 pl-4 text-foreground/70 italic">
                            <p>"{item.quote.text}"</p>
                            {item.quote.attribution && (
                              <cite className="mt-2 block text-[0.7rem] font-mono uppercase tracking-[0.2em] text-foreground/60 not-italic">
                                {item.quote.attribution}
                              </cite>
                            )}
                          </blockquote>
                        )}

                        {item.media && typeof item.media === 'object' && (
                          <div className="mt-6 relative aspect-[3/2] overflow-hidden rounded-2xl border border-foreground/10 bg-background/60">
                            <Media
                              fill
                              imgClassName="object-cover"
                              videoClassName="h-full w-full object-cover"
                              resource={item.media}
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
      </div>
    </section>
  )
}
