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
      <div className="flex items-center justify-between gap-4 py-8">
        <Link href="/">
          <Logo loading="eager" priority="high" className="text-primary" />
        </Link>
        <HeaderNav className="hidden md:flex" data={data} />
        <button
          aria-controls="site-mobile-nav"
          aria-expanded={mobileNavOpen}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/80 px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] text-foreground/80 transition hover:text-foreground md:hidden"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          type="button"
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>{mobileNavOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>
      <div
        className={cn(
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-300',
          mobileNavOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
        )}
        id="site-mobile-nav"
      >
        <div className="rounded-[24px] border border-foreground/10 bg-card/90 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.6)] backdrop-blur">
          <HeaderNav data={data} variant="mobile" />
        </div>
      </div>
    </header>
  )
}
