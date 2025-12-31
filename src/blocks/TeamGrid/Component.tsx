import React from 'react'

import type { TeamGridBlock as TeamGridBlockProps, Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Member = NonNullable<TeamGridBlockProps['members']>[number]

/* ───────────────────────────────────────────────────────────────
   Baseball Card Component
   Old-school trading card style with stats grid
─────────────────────────────────────────────────────────────── */
const BaseballCard: React.FC<{ member: Member; index: number }> = ({ member, index }) => {
  const photo = member.photo as Media | undefined

  return (
    <div
      className={cn(
        'opacity-0 animate-fade-up',
        'group perspective-1000',
      )}
      style={{
        animationDelay: `${200 + index * 120}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Card container with cardboard texture */}
      <div
        className={cn(
          'relative overflow-hidden rounded-lg',
          'bg-gradient-to-br from-amber-50 via-amber-100/80 to-orange-100',
          'dark:from-amber-950/90 dark:via-stone-900 dark:to-stone-950',
          'border-4 border-amber-200/80 dark:border-amber-800/60',
          'shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]',
          'dark:shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]',
          'transition-transform duration-300 group-hover:scale-[1.02] group-hover:-rotate-1',
        )}
      >
        {/* Aged paper texture overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-[0.04] mix-blend-multiply dark:mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Card number badge */}
        {member.number && (
          <div className="absolute top-2 right-2 z-30">
            <span
              className={cn(
                'inline-flex items-center justify-center',
                'w-8 h-8 rounded-full',
                'bg-amber-600 dark:bg-amber-500',
                'text-white font-bold text-sm',
                'shadow-md',
                'border-2 border-amber-400 dark:border-amber-300',
              )}
            >
              {member.number}
            </span>
          </div>
        )}

        {/* Photo section with vintage frame */}
        <div className="relative mx-3 mt-3">
          <div
            className={cn(
              'relative aspect-[3/4] overflow-hidden rounded',
              'border-2 border-amber-300/60 dark:border-amber-700/60',
              'shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]',
            )}
          >
            {/* Sepia/vintage overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-amber-900/5 via-transparent to-amber-950/20 pointer-events-none" />
            <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(120,80,40,0.15)] pointer-events-none" />

            {photo ? (
              <MediaComponent
                fill
                imgClassName="object-cover object-top"
                resource={photo}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-900 dark:to-amber-950 flex items-center justify-center">
                <span className="text-4xl font-display text-amber-600/40 dark:text-amber-400/40">
                  {member.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name plate */}
        <div
          className={cn(
            'mx-3 mt-3 py-2 px-3 rounded',
            'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700',
            'dark:from-amber-800 dark:via-amber-700 dark:to-amber-800',
            'border border-amber-500/50 dark:border-amber-600/50',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.2)]',
          )}
        >
          <h3 className="font-display text-lg text-center text-amber-50 tracking-wide truncate">
            {member.name}
          </h3>
          {member.role && (
            <p className="text-xs text-center text-amber-200/80 uppercase tracking-widest mt-0.5 truncate">
              {member.role}
            </p>
          )}
        </div>

        {/* Stats section */}
        <div className="mx-3 mt-3 mb-3">
          <div
            className={cn(
              'rounded overflow-hidden',
              'bg-amber-50/80 dark:bg-stone-900/80',
              'border border-amber-300/50 dark:border-amber-800/50',
            )}
          >
            {/* Stats header */}
            <div
              className={cn(
                'py-1 px-2 text-center',
                'bg-amber-200/60 dark:bg-amber-900/60',
                'border-b border-amber-300/50 dark:border-amber-800/50',
              )}
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-amber-800 dark:text-amber-300">
                Player Stats
              </span>
            </div>

            {/* Stats grid */}
            <div className="divide-y divide-amber-200/50 dark:divide-amber-800/50">
              {member.hometown && (
                <div className="flex items-center justify-between py-1.5 px-2">
                  <span className="text-[10px] uppercase tracking-wider text-amber-700/70 dark:text-amber-400/70">
                    Hometown
                  </span>
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-100 truncate ml-2">
                    {member.hometown}
                  </span>
                </div>
              )}
              {member.yearsActive && (
                <div className="flex items-center justify-between py-1.5 px-2">
                  <span className="text-[10px] uppercase tracking-wider text-amber-700/70 dark:text-amber-400/70">
                    Seasons
                  </span>
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-100 truncate ml-2">
                    {member.yearsActive}
                  </span>
                </div>
              )}
              {member.funFact && (
                <div className="flex items-center justify-between py-1.5 px-2">
                  <span className="text-[10px] uppercase tracking-wider text-amber-700/70 dark:text-amber-400/70">
                    Notable
                  </span>
                  <span className="text-xs font-medium text-amber-900 dark:text-amber-100 truncate ml-2">
                    {member.funFact}
                  </span>
                </div>
              )}
              {/* Fallback if no stats provided */}
              {!member.hometown && !member.yearsActive && !member.funFact && (
                <div className="py-2 px-2 text-center">
                  <span className="text-[10px] italic text-amber-600/60 dark:text-amber-400/60">
                    Stats coming soon
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative corner wear marks */}
        <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-br from-amber-300/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-amber-400/15 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────────
   Main TeamGrid Block
─────────────────────────────────────────────────────────────── */
export const TeamGridBlock: React.FC<TeamGridBlockProps> = ({
  heading,
  subheading,
  members,
  layout = 'list',
}) => {
  if (!members || members.length === 0) {
    return null
  }

  const isListLayout = layout === 'list'
  const isBaseballLayout = layout === 'baseballCards'

  return (
    <section className="container my-16">
      <div
        className={cn(
          'vintage-card p-6 md:p-10 opacity-0 animate-reveal',
          isBaseballLayout && 'bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/50 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/30',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className={cn('mb-8', isBaseballLayout && 'text-center')}>
            {subheading && (
              <div className={cn('flex items-center gap-3 mb-3', isBaseballLayout && 'justify-center')}>
                <span className="ornament-star text-accent/50" />
                <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                  {subheading}
                </span>
                {isBaseballLayout && <span className="ornament-star text-accent/50" />}
              </div>
            )}
            {heading && (
              <h2 className="font-display text-display-sm md:text-display-md">{heading}</h2>
            )}
          </div>
        )}

        {isListLayout ? (
          /* Simple list layout */
          <ul className="space-y-3">
            {members.map((member, index) => (
              <li
                key={member.id || index}
                className={cn(
                  'flex items-center gap-4 opacity-0 animate-fade-up',
                  'py-3 border-b border-border/50 last:border-0',
                )}
                style={{
                  animationDelay: `${200 + index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <span className="h-2 w-2 rounded-full bg-accent/60 shrink-0" />
                <span className="font-medium">{member.name}</span>
                {member.role && (
                  <>
                    <span className="text-muted-foreground/30">—</span>
                    <span className="text-muted-foreground">{member.role}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : isBaseballLayout ? (
          /* Baseball cards layout */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {members.map((member, index) => (
              <BaseballCard key={member.id || index} member={member} index={index} />
            ))}
          </div>
        ) : (
          /* Cards with photos layout */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => {
              const photo = member.photo as Media | undefined

              return (
                <div
                  key={member.id || index}
                  className={cn(
                    'opacity-0 animate-fade-up',
                    'text-center',
                  )}
                  style={{
                    animationDelay: `${200 + index * 100}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  {photo ? (
                    <div className="frame-vintage overflow-hidden mx-auto w-32 h-32 rounded-full">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/10 via-transparent to-black/15 pointer-events-none rounded-full" />
                        <MediaComponent
                          fill
                          imgClassName="object-cover"
                          resource={photo}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground/50">
                        {member.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <h3 className="mt-4 font-display text-lg">{member.name}</h3>
                  {member.role && (
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
