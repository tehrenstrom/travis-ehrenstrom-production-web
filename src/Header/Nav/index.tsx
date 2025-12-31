'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { FlowerIcon } from '@/components/icons/HandDrawnIcons'

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
        isMobile && 'flex-col items-start gap-2 w-full',
        className,
      )}
    >
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            className={cn(
              'group relative px-4 py-2 text-sm font-medium tracking-wide text-foreground/70',
              'transition-all duration-300 hover:text-accent',
              isMobile && 'text-base py-3 w-full border-b border-border/30 last:border-b-0',
            )}
            key={i}
            {...link}
            appearance="link"
          >
            {/* Organic dot underline on hover - desktop only */}
            {!isMobile && (
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-accent/0 text-xs transition-all duration-300 group-hover:text-accent/80"
              >
                ·
              </span>
            )}
          </CMSLink>
        )
      })}

      {/* Decorative flower for desktop */}
      {!isMobile && navItems.length > 0 && (
        <FlowerIcon size="sm" className="ml-2 text-accent/50" />
      )}
    </nav>
  )
}
