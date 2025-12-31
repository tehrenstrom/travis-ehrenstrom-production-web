'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type HeaderNavProps = {
  data: HeaderType
  className?: string
  variant?: 'desktop' | 'mobile'
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ className, data, variant = 'desktop' }) => {
  const navItems = data?.navItems || []
  const isMobile = variant === 'mobile'

  return (
    <nav
      className={cn(
        'flex items-center gap-1',
        isMobile && 'flex-col items-start gap-1 w-full',
        className,
      )}
    >
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            className={cn(
              'group relative px-4 py-2 text-label uppercase tracking-stamp font-semibold text-foreground/70',
              'transition-colors duration-200 hover:text-foreground',
              isMobile && 'text-sm tracking-vintage py-3 w-full border-b border-border/50 last:border-b-0',
            )}
            key={i}
            {...link}
            appearance="link"
          >
            {/* Decorative underline on hover - desktop only */}
            {!isMobile && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-accent/50 transition-all duration-300 group-hover:w-3/4"
              />
            )}
          </CMSLink>
        )
      })}

      {/* Decorative separator and accent for desktop */}
      {!isMobile && navItems.length > 0 && (
        <>
          <span className="mx-2 h-4 w-px bg-border" aria-hidden="true" />
          <span className="ornament-diamond text-accent/40" aria-hidden="true" />
        </>
      )}
    </nav>
  )
}
