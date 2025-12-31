import React from 'react'

import type { TeamGridBlock as TeamGridBlockProps, Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { cn } from '@/utilities/ui'

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

  return (
    <section className="container my-16">
      <div
        className="vintage-card p-6 md:p-10 opacity-0 animate-reveal"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-8">
            {subheading && (
              <div className="flex items-center gap-3 mb-3">
                <span className="ornament-star text-accent/50" />
                <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                  {subheading}
                </span>
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

