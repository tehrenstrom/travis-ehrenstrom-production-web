import React from 'react'

import type { TeamGridBlock as TeamGridBlockProps, Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Member = NonNullable<TeamGridBlockProps['members']>[number]

/* ───────────────────────────────────────────────────────────────
   Roster row — photo-free EPK treatment for the "baseballCards"
   layout: mono number, name + role, then hometown / years / notable
   as Space Mono data columns with hairline rules. No image slots.
─────────────────────────────────────────────────────────────── */
const ROSTER_COLS = 'md:grid-cols-[2.5rem_1.6fr_1fr_1fr_1.4fr]'

const RosterRow: React.FC<{ member: Member; index: number }> = ({ member, index }) => (
  <li
    className={cn(
      'grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 md:gap-x-6',
      ROSTER_COLS,
      'border-b border-border py-4 opacity-0 animate-fade-up',
    )}
    style={{
      animationDelay: `${200 + index * 75}ms`,
      animationFillMode: 'forwards',
    }}
  >
    <span className="font-mono text-2xs text-primary">{member.number || '·'}</span>

    <div>
      <h3 className="font-semibold text-base md:text-lg">{member.name}</h3>
      {member.role && (
        <p className="mt-0.5 font-mono text-2xs uppercase tracking-label text-muted-foreground">
          {member.role}
        </p>
      )}
    </div>

    <span className="col-start-2 font-mono text-2xs text-muted-foreground md:col-start-auto md:text-xs">
      {member.hometown}
    </span>
    <span className="col-start-2 font-mono text-2xs text-muted-foreground md:col-start-auto md:text-xs">
      {member.yearsActive}
    </span>
    <span className="col-start-2 font-mono text-2xs italic text-muted-foreground md:col-start-auto md:text-xs">
      {member.funFact}
    </span>
  </li>
)

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
        className="rounded-md border border-border bg-card p-6 md:p-10 opacity-0 animate-reveal"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-8">
            {subheading && (
              <p className="font-mono text-label uppercase text-primary mb-3">{subheading}</p>
            )}
            {heading && (
              <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
                {heading}
              </h2>
            )}
          </div>
        )}

        {isListLayout ? (
          /* Lineup rows — 2-col grid of hairline-separated name/role rows */
          <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {members.map((member, index) => (
              <li
                key={member.id || index}
                className={cn(
                  'flex items-baseline justify-between gap-3 opacity-0 animate-fade-up',
                  'border-b border-border py-3',
                )}
                style={{
                  animationDelay: `${200 + index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <span className="font-semibold">{member.name}</span>
                {member.role && (
                  <span className="text-right font-mono text-2xs uppercase tracking-label text-muted-foreground">
                    {member.role}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : isBaseballLayout ? (
          /* Roster table — photo-free EPK rows */
          <div>
            {/* Column heads (desktop only) */}
            <div
              className={cn(
                'hidden md:grid items-baseline gap-x-6 border-b border-foreground/30 pb-2',
                ROSTER_COLS,
              )}
            >
              <span aria-hidden="true" className="font-mono text-2xs text-muted-foreground/60">
                №
              </span>
              <span className="font-mono text-2xs uppercase tracking-label text-muted-foreground/60">
                Member
              </span>
              <span className="font-mono text-2xs uppercase tracking-label text-muted-foreground/60">
                Hometown
              </span>
              <span className="font-mono text-2xs uppercase tracking-label text-muted-foreground/60">
                Years
              </span>
              <span className="font-mono text-2xs uppercase tracking-label text-muted-foreground/60">
                Notable
              </span>
            </div>
            <ul>
              {members.map((member, index) => (
                <RosterRow key={member.id || index} member={member} index={index} />
              ))}
            </ul>
          </div>
        ) : (
          /* Cards with photos layout */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => {
              const photo = member.photo as Media | undefined

              return (
                <div
                  key={member.id || index}
                  className="opacity-0 animate-fade-up"
                  style={{
                    animationDelay: `${200 + index * 100}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-arch bg-secondary">
                    {photo ? (
                      <MediaComponent fill imgClassName="object-cover" resource={photo} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-4xl font-extrabold text-muted-foreground/40">
                          {member.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-b border-border py-3">
                    <h3 className="font-semibold">{member.name}</h3>
                    {member.role && (
                      <p className="text-right font-mono text-2xs uppercase tracking-label text-muted-foreground">
                        {member.role}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
