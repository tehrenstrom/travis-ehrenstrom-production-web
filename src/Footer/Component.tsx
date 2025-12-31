import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'

const socialLinks = [
  { label: 'Spotify', href: 'https://open.spotify.com/artist/3XsD0GhBJdq7OQX4k8GKRx', external: true },
  { label: 'Instagram', href: 'https://instagram.com/travisehrenstrom', external: true },
  { label: 'Facebook', href: 'https://facebook.com/travisehrenstromband', external: true },
  { label: 'YouTube', href: 'https://youtube.com/@travisehrenstrom', external: true },
  { label: 'Bandcamp', href: 'https://travisehrenstrom.bandcamp.com', external: true },
]

const siteLinks = [
  { label: 'Shows', href: '/shows' },
  { label: 'Music', href: '/music' },
  { label: 'Store', href: '/store' },
  { label: 'About', href: '/about' },
  { label: 'News', href: '/posts' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-primary text-primary-foreground relative overflow-hidden" data-theme="dark">
      {/* Organic gradient background */}
      <div className="absolute inset-0 bg-tiedye opacity-30 pointer-events-none" />
      
      {/* Decorative top wave */}
      <div className="h-1 bg-gradient-to-r from-accent/40 via-highlight/60 to-accent/40" />

      {/* Organic divider section */}
      <div className="container py-10 relative">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary-foreground/20 rounded-full" />
          <span className="text-accent text-lg">☼</span>
          <span className="h-px w-20 bg-primary-foreground/15 rounded-full" />
          <span className="text-accent/70">✿</span>
          <span className="h-px w-20 bg-primary-foreground/15 rounded-full" />
          <span className="text-accent text-lg">☼</span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary-foreground/20 rounded-full" />
        </div>
      </div>

      {/* Main footer content */}
      <div className="container pb-10 relative">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link className="inline-block" href="/">
              <Logo variant="full" className="text-primary-foreground" />
            </Link>
            <p className="mt-6 max-w-sm text-sm text-primary-foreground/60 leading-relaxed">
              Pacific Northwest Americana & jam-rock from Central Oregon. 
              Original songs, campfire vibes, and a whole lot of heart. ✦
            </p>

            {/* Social links - organic pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-full',
                    'text-xs font-medium tracking-wide',
                    'border border-primary-foreground/15 bg-primary-foreground/5',
                    'transition-all duration-300',
                    'hover:bg-accent/20 hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10',
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-sm font-medium tracking-wide text-primary-foreground/50 mb-5 flex items-center gap-2">
              <span className="text-accent/60 text-xs">✦</span>
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {siteLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-sm text-primary-foreground/70 transition-all duration-300',
                    'hover:text-accent hover:translate-x-1',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Settings column */}
          <div>
            <h3 className="text-sm font-medium tracking-wide text-primary-foreground/50 mb-5 flex items-center gap-2">
              <span className="text-accent/60 text-xs">✦</span>
              Settings
            </h3>
            <ThemeSelector />

            <div className="mt-8">
              <p className="text-xs font-medium text-primary-foreground/40 mb-2 flex items-center gap-2">
                <span className="text-accent/50">✿</span>
                Get in touch
              </p>
              <a
                href="mailto:hello@travisehrenstrom.com"
                className="text-sm text-primary-foreground/70 hover:text-accent transition-colors duration-300"
              >
                hello@travisehrenstrom.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 relative">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <div className="flex items-center gap-3 text-xs text-primary-foreground/40">
              <span className="text-accent/50">☼</span>
              <span>© {currentYear} Travis Ehrenstrom Band</span>
              <span className="text-accent/50">☼</span>
            </div>

            {/* Tagline */}
            <p className="text-xs text-primary-foreground/30 flex items-center gap-2">
              <span>Made with</span>
              <span className="text-accent">♥</span>
              <span>in Bend, Oregon</span>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative bottom gradient */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent/70 to-highlight/60" />
    </footer>
  )
}
