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
          'rounded-md border border-border bg-card p-6 md:p-8',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {heading && (
          <h2 className="font-display font-extrabold tracking-display text-display-sm mb-6">
            {heading}
          </h2>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => {
            if (!link?.url) return null
            return (
              <a
                className={cn(
                  'inline-flex items-center rounded-full px-4 py-2',
                  'text-label uppercase font-semibold',
                  'border border-border bg-card text-foreground',
                  'transition-colors duration-fast ease-teb-out',
                  'hover:bg-secondary hover:border-foreground/35',
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
      </div>
    </section>
  )
}
