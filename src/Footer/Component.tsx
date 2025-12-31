import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeartIcon } from '@/components/icons/HandDrawnIcons'

const socialLinks = [
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/4cNI32lE8kJmcc1c0ofuhx',
    external: true,
  },
  {
    label: 'Apple Music',
    href: 'https://music.apple.com/us/artist/travis-ehrenstrom/274869822',
    external: true,
  },
  { label: 'Instagram', href: 'https://www.instagram.com/tehrenstrom/#', external: true },
  { label: 'Facebook', href: 'https://www.facebook.com/TravisEhrenstrom/', external: true },
  { label: 'YouTube', href: 'https://www.youtube.com/@travisehrenstrom', external: true },
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
      {/* Simple top border */}
      <div className="h-px bg-primary-foreground/10" />

      {/* Main footer content */}
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link className="inline-block" href="/">
              <Logo variant="full" className="text-primary-foreground" />
            </Link>
            <p className="mt-6 max-w-sm text-sm text-primary-foreground/60 leading-relaxed">
              Pacific Northwest Americana & jam-rock from Central Oregon. Original songs, campfire
              vibes, and a whole lot of heart.
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
                    'inline-flex items-center px-4 py-2 rounded-full',
                    'text-xs font-medium tracking-wide',
                    'border border-primary-foreground/15 bg-primary-foreground/5',
                    'transition-all duration-200',
                    'hover:bg-primary-foreground/10 hover:border-primary-foreground/25',
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-primary-foreground/40 mb-5">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {siteLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Settings column */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-primary-foreground/40 mb-5">
              Settings
            </h3>
            <ThemeSelector />

            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-primary-foreground/40 mb-2">
                Contact
              </p>
              <a
                href="mailto:travis@travisehrenstrom.com"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                travis@travisehrenstrom.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Copyright */}
            <p className="text-xs text-primary-foreground/40">
              © {currentYear} Travis Ehrenstrom Band
            </p>

            {/* Tagline - ONE strategic icon use */}
            <p className="text-xs text-primary-foreground/40 flex items-center gap-1.5">
              <span>Made with</span>
              <HeartIcon size="sm" className="text-accent" />
              <span>in Bend, Oregon</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
