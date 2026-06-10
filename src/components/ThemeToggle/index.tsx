'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/providers/Theme'
import { cn } from '@/utilities/ui'

/**
 * Sun/Dusk theme toggle for the header. The footer's ThemeSelector still offers
 * the explicit Auto option; this is the one-tap version per the design system's
 * nav pattern.
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { setTheme, theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'text-muted-foreground transition-colors duration-fast ease-teb-out',
        'hover:bg-primary/10 hover:text-primary active:scale-[.92]',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
        className,
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      type="button"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export default ThemeToggle
