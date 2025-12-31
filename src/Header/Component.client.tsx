'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
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
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="flex items-center justify-between gap-4 py-6 md:py-8">
        <Link href="/" className="group">
          <Logo loading="eager" priority="high" className="text-primary" />
        </Link>

        <HeaderNav className="hidden md:flex" data={data} />

        {/* Vintage-styled mobile menu button */}
        <button
          aria-controls="site-mobile-nav"
          aria-expanded={mobileNavOpen}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2',
            'text-label uppercase tracking-stamp font-semibold',
            'border border-foreground/20 bg-card',
            'shadow-vintage transition-all duration-200',
            'hover:shadow-vintage-lg hover:-translate-y-0.5',
            'md:hidden',
          )}
          onClick={() => setMobileNavOpen((prev) => !prev)}
          type="button"
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{mobileNavOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Decorative header divider */}
      <div className="hidden md:flex items-center justify-center -mt-2 mb-2">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
        <span className="ornament-diamond mx-3 text-accent/40" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
      </div>

      {/* Mobile navigation dropdown */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-300',
          mobileNavOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
        )}
        id="site-mobile-nav"
      >
        <div className="vintage-card p-6 mb-4">
          {/* Decorative top border */}
          <div className="flex items-center justify-center mb-6">
            <span className="h-px flex-1 bg-border" />
            <span className="ornament-star mx-4 text-accent/50" />
            <span className="h-px flex-1 bg-border" />
          </div>

          <HeaderNav data={data} variant="mobile" />

          {/* Decorative bottom border */}
          <div className="flex items-center justify-center mt-6">
            <span className="h-px flex-1 bg-border" />
            <span className="ornament-diamond mx-4 text-accent/50" />
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    </header>
  )
}
