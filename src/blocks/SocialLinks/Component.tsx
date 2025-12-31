import React from 'react'

import type { SocialLinksBlock as SocialLinksBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

export const SocialLinksBlock: React.FC<
  SocialLinksBlockProps & {
    id?: string
  }
> = ({ heading, links }) => {
  if (!links || links.length === 0) return null

  return (
    <section className="container">
      <div
        className={cn(
          'vintage-card p-6 md:p-8',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Decorative header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="ornament-star text-accent/50" />
          {heading && (
            <h2 className="font-display text-display-sm">
              {heading}
            </h2>
          )}
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => {
            if (!link?.url) return null
            return (
              <a
                className={cn(
                  'inline-flex items-center px-4 py-2',
                  'text-label uppercase tracking-stamp font-semibold',
                  'border border-border bg-card',
                  'shadow-vintage-inset transition-all duration-200',
                  'hover:shadow-vintage hover:-translate-y-0.5 hover:border-foreground/30',
                )}
                href={link.url}
                key={`${link.label ?? 'social'}-${index}`}
                rel={link.newTab ? 'noreferrer' : undefined}
                target={link.newTab ? '_blank' : undefined}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Decorative footer */}
        <div className="flex items-center justify-center mt-6">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="ornament-diamond mx-4 text-accent/40" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </section>
  )
}
