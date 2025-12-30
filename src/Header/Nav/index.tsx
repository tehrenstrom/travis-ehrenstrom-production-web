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
        'flex items-center gap-5 text-xs uppercase tracking-[0.25em]',
        isMobile && 'flex-col items-start gap-4 text-sm tracking-[0.2em]',
        className,
      )}
    >
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            className={cn(
              'text-foreground/80 transition hover:text-foreground',
              isMobile && 'text-base tracking-[0.22em]',
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
