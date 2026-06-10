'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMobileNavOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href="/" className="group inline-flex items-baseline gap-3">
            <Logo loading="eager" priority="high" className="text-foreground" />
            <span className="hidden font-mono text-2xs uppercase tracking-label text-muted-foreground lg:inline">
              Travis Ehrenstrom Band
            </span>
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <HeaderNav className="hidden md:flex" data={data} />

            <ThemeToggle />

            {/* Primary site-wide action — always visible, desktop and mobile */}
            <Link
              className={cn(buttonVariants({ size: 'sm', variant: 'default' }), 'whitespace-nowrap')}
              href="/mailing-list"
            >
              Join the list
            </Link>

            {/* Mobile menu button */}
            <button
              aria-controls="site-mobile-nav"
              aria-expanded={mobileNavOpen}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-md',
                'text-sm font-medium',
                'border border-border bg-card',
                'transition-colors duration-fast ease-teb-out',
                'hover:bg-secondary hover:border-foreground/35',
                'md:hidden',
              )}
              onClick={() => setMobileNavOpen((prev) => !prev)}
              type="button"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>{mobileNavOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation dropdown */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-base ease-teb-out',
            mobileNavOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
          )}
          id="site-mobile-nav"
        >
          <div className="rounded-md border border-border bg-card p-6 mb-4">
            <HeaderNav data={data} variant="mobile" />
          </div>
        </div>
      </div>
    </header>
  )
}
