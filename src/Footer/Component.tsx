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
    <footer className="mt-auto bg-primary text-primary-foreground" data-theme="dark">
      {/* Decorative top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

      {/* Ornamental divider section */}
      <div className="container py-8">
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary-foreground/20" />
          <span className="ornament-star text-accent" />
          <span className="h-px w-24 bg-primary-foreground/20" />
          <span className="ornament-diamond text-accent/60" />
          <span className="h-px w-24 bg-primary-foreground/20" />
          <span className="ornament-star text-accent" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary-foreground/20" />
        </div>
      </div>

      {/* Main footer content */}
      <div className="container pb-8">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link className="inline-block" href="/">
              <Logo variant="full" className="text-primary-foreground" />
            </Link>
            <p className="mt-6 max-w-sm text-sm text-primary-foreground/60 leading-relaxed">
              Pacific Northwest Americana & jam-rock from Central Oregon. 
              Original songs, campfire vibes, and a whole lot of heart.
            </p>

            {/* Social links */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center px-3 py-1.5',
                    'text-label-sm uppercase tracking-stamp',
                    'border border-primary-foreground/20 bg-primary-foreground/5',
                    'transition-all duration-200',
                    'hover:bg-primary-foreground/10 hover:border-primary-foreground/30 hover:-translate-y-0.5',
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-label uppercase tracking-stamp-wide text-primary-foreground/50 mb-4">
              Navigate
            </h3>
            <nav className="flex flex-col gap-2">
              {siteLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-sm text-primary-foreground/70 transition-colors duration-200',
                    'hover:text-primary-foreground',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Settings column */}
          <div>
            <h3 className="text-label uppercase tracking-stamp-wide text-primary-foreground/50 mb-4">
              Settings
            </h3>
            <ThemeSelector />

            <div className="mt-6">
              <p className="text-label-sm uppercase tracking-stamp text-primary-foreground/40 mb-2">
                Contact
              </p>
              <a
                href="mailto:hello@travisehrenstrom.com"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                hello@travisehrenstrom.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright with vintage frame */}
            <div className="flex items-center gap-3 text-label-sm text-primary-foreground/40">
              <span className="ornament-diamond opacity-50" />
              <span className="uppercase tracking-stamp-wide">
                © {currentYear} Travis Ehrenstrom Band
              </span>
              <span className="ornament-diamond opacity-50" />
            </div>

            {/* Tagline */}
            <p className="text-label-sm uppercase tracking-stamp text-primary-foreground/30">
              Made with love in Bend, Oregon
            </p>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0" />
    </footer>
  )
}
