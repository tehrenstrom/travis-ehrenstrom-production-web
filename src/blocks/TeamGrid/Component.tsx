import React from 'react'

import type { TeamGridBlock as TeamGridBlockProps, Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Member = NonNullable<TeamGridBlockProps['members']>[number]

/* ───────────────────────────────────────────────────────────────
   Member detail card — flat card with photo and hairline detail rows
   (used for the "baseballCards" layout)
─────────────────────────────────────────────────────────────── */
const MemberDetailCard: React.FC<{ member: Member; index: number }> = ({ member, index }) => {
  const photo = member.photo as Media | undefined

  const details = [
    member.hometown ? { label: 'Hometown', value: member.hometown } : null,
    member.yearsActive ? { label: 'Seasons', value: member.yearsActive } : null,
    member.funFact ? { label: 'Notable', value: member.funFact } : null,
  ].filter((d): d is { label: string; value: string } => d !== null)

  return (
    <div
      className="opacity-0 animate-fade-up"
      style={{
        animationDelay: `${200 + index * 100}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="overflow-hidden rounded-md border border-border bg-card">
        {/* Photo */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {photo ? (
            <MediaComponent fill imgClassName="object-cover object-top" resource={photo} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-4xl font-extrabold text-muted-foreground/40">
                {member.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>

        {/* Name + number + role */}
        <div className="px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold truncate">{member.name}</h3>
            {member.number && (
              <span className="shrink-0 font-mono text-2xs text-muted-foreground">
                #{member.number}
              </span>
            )}
          </div>
          {member.role && (
            <p className="mt-0.5 font-mono text-2xs uppercase tracking-label text-muted-foreground truncate">
              {member.role}
            </p>
          )}
        </div>

        {/* Detail rows */}
        {details.length > 0 && (
          <div className="border-t border-border">
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-2 last:border-0"
              >
                <span className="font-mono text-2xs uppercase tracking-label text-muted-foreground">
                  {detail.label}
                </span>
                <span className="text-xs text-foreground truncate">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
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
          /* Member detail cards layout */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {members.map((member, index) => (
              <MemberDetailCard key={member.id || index} member={member} index={index} />
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
