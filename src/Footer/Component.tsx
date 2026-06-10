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
  // Store hidden from nav until CDs/merch are stocked (~Oct 2026); route still live.
  { label: 'About', href: '/about' },
  { label: 'News', href: '/posts' },
  { label: 'Booking & Press', href: '/booking' },
  { label: 'House Concerts', href: '/house-concerts' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    // Dusk surface: data-theme=dark makes bg-background resolve to warm sepia-900
    <footer className="mt-auto bg-background text-foreground teb-grain" data-theme="dark">
      <div className="h-px bg-foreground/10" />

      {/* Main footer content */}
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link className="inline-block" href="/">
              <Logo variant="full" className="text-foreground" />
            </Link>
            <p className="mt-6 max-w-sm text-sm text-foreground/70 leading-relaxed">
              Original songs from Central Oregon. Campfire vibes and a whole lot of heart.
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
                    'text-xs font-medium',
                    'border border-foreground/15 bg-foreground/5',
                    'transition-colors duration-fast ease-teb-out',
                    'hover:bg-foreground/10 hover:border-foreground/30',
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="font-mono text-2xs font-normal uppercase tracking-label text-accent mb-5">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {siteLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact + settings column */}
          <div>
            <h3 className="font-mono text-2xs font-normal uppercase tracking-label text-accent mb-5">
              Contact
            </h3>
            <a
              href="mailto:travisehrenstrom@gmail.com"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              travisehrenstrom@gmail.com
            </a>

            <div className="mt-8">
              <p className="font-mono text-2xs uppercase tracking-label text-foreground/40 mb-2">
                Theme
              </p>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/10">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-mono text-2xs text-foreground/40">
              © {currentYear} Travis Ehrenstrom Band
            </p>

            <p className="font-mono text-2xs text-foreground/40 flex items-center gap-1.5">
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
