'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { FlowerIcon, MountainIcon, DiamondIcon } from '@/components/icons/HandDrawnIcons'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section className="relative -mt-[10.4rem] min-h-[100vh] overflow-hidden text-white" data-theme="dark">
      {/* Background image - full bleed */}
      {media && typeof media === 'object' && (
        <div className="absolute inset-0">
          <Media
            fill
            imgClassName="object-cover object-center"
            priority
            resource={media}
            videoClassName="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Gradient overlays for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

      {/* Aged photo grain effect */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Main content */}
      <div className="container relative z-10 flex min-h-[100vh] flex-col justify-center pb-24 pt-40">
        <div className="max-w-4xl">
          {/* Eyebrow with hand-drawn icons */}
          <div
            className="mb-8 flex items-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <MountainIcon size="sm" className="text-amber-400/80" />
            <span className="h-px w-10 bg-amber-400/40" />
            <span className="text-label uppercase tracking-[0.25em] text-amber-400/90 font-medium">
              Pacific Northwest Americana
            </span>
            <span className="h-px w-10 bg-amber-400/40" />
            <FlowerIcon size="sm" className="text-amber-400/80" />
          </div>

          {richText && (
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <RichText
                className={cn(
                  'mb-10 prose-invert',
                  // H1: Large display, balanced text, no orphans
                  'prose-h1:font-display prose-h1:text-[3.5rem] prose-h1:font-normal prose-h1:tracking-[0.01em] prose-h1:leading-[1.05]',
                  'prose-h1:text-balance prose-h1:max-w-[14ch]',
                  'sm:prose-h1:text-[4.5rem]',
                  'md:prose-h1:text-[5.5rem]',
                  'lg:prose-h1:text-[6.5rem]',
                  // H2: Subtitle style
                  'prose-h2:text-xl prose-h2:font-sans prose-h2:font-normal prose-h2:text-white/60 prose-h2:tracking-wide',
                  'prose-h2:mt-0 prose-h2:mb-1',
                  'md:prose-h2:text-2xl',
                  // Paragraphs
                  'prose-p:text-white/50 prose-p:text-lg prose-p:max-w-xl',
                )}
                data={richText}
                enableGutter={false}
              />
            </div>
          )}

          {/* Decorative divider with icons */}
          <div
            className="mb-10 flex items-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <DiamondIcon size="sm" className="text-amber-400/50" />
            <span className="h-px w-32 bg-gradient-to-r from-white/30 to-transparent" />
          </div>

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-5">
              {links.map(({ link }, i) => {
                const isPrimary = i === 0
                const delay = 400 + i * 100
                return (
                  <li
                    className="opacity-0 animate-fade-up"
                    key={i}
                    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
                  >
                    <CMSLink
                      {...link}
                      appearance={isPrimary ? 'default' : 'outline'}
                      className={cn(
                        'min-w-[180px] justify-center',
                        isPrimary
                          ? 'bg-amber-400 text-black border-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                          : 'border-white/40 bg-white/5 text-white hover:bg-white/15 hover:border-white/60 backdrop-blur-sm',
                      )}
                      size="lg"
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <span className="text-label-sm uppercase tracking-widest text-white/30">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
