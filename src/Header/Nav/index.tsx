'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
// Icons removed from nav - used sparingly per brand strategy

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
              'rounded-full px-3.5 py-2 text-sm font-medium text-foreground/75',
              'transition-colors duration-fast ease-teb-out',
              'hover:bg-primary/10 hover:text-primary',
              isMobile &&
                'rounded-none text-base py-3 w-full border-b border-border last:border-b-0 hover:bg-transparent',
            )}
            key={i}
            {...link}
            appearance="link"
          />
        )
      })}
    </nav>
  )
}
