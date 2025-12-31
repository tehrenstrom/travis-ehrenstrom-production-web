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
// Icons used sparingly - only in mobile menu and specific places

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

        {/* Organic mobile menu button */}
        <button
          aria-controls="site-mobile-nav"
          aria-expanded={mobileNavOpen}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
            'text-sm font-medium tracking-wide',
            'border-2 border-foreground/15 bg-card/80 backdrop-blur-sm',
            'transition-all duration-300',
            'hover:bg-accent/10 hover:border-accent/30 hover:-translate-y-1',
            'md:hidden',
          )}
          onClick={() => setMobileNavOpen((prev) => !prev)}
          type="button"
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{mobileNavOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>


      {/* Mobile navigation dropdown */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-500 ease-out',
          mobileNavOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
        )}
        id="site-mobile-nav"
      >
        <div className="organic-card p-6 mb-4">
          <HeaderNav data={data} variant="mobile" />
        </div>
      </div>
    </header>
  )
}
