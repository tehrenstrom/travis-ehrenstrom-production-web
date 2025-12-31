'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section className="relative -mt-[10.4rem] overflow-hidden text-white" data-theme="dark">
      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/95" />

      {/* Aged photo grain effect */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette corners */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Subtle warm glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />

      {/* Decorative border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container relative z-10 grid gap-10 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-28 lg:pt-44">
        {/* Content Side */}
        <div className="order-2 lg:order-1">
          {/* Eyebrow */}
          <div
            className="mb-6 flex items-center gap-3 opacity-0 animate-fade-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <span className="h-px w-8 bg-amber-400/60" />
            <span className="text-label uppercase tracking-stamp text-amber-400/80 font-mono">
              PNW Americana
            </span>
            <span className="h-px w-8 bg-amber-400/60" />
          </div>

          {richText && (
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <RichText
                className={cn(
                  'mb-8 max-w-2xl prose-invert',
                  'prose-h1:font-display prose-h1:text-display-lg prose-h1:font-normal prose-h1:tracking-[0.02em] prose-h1:leading-[1.1]',
                  'md:prose-h1:text-display-xl',
                  'prose-h2:text-xl prose-h2:font-sans prose-h2:font-normal prose-h2:text-white/70',
                  'md:prose-h2:text-2xl',
                  'prose-p:text-white/60 prose-p:text-lg',
                )}
                data={richText}
                enableGutter={false}
              />
            </div>
          )}

          {/* Decorative divider */}
          <div
            className="mb-8 flex items-center gap-4 opacity-0 animate-fade-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <span className="ornament-diamond text-amber-400/50" />
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
          </div>

          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
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
                        isPrimary
                          ? 'shadow-poster'
                          : 'border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50',
                      )}
                      size="lg"
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Media Side */}
        <div className="order-1 lg:order-2">
          {media && typeof media === 'object' && (
            <div
              className="opacity-0 animate-reveal"
              style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
            >
              <div className="relative corners-poster">
                {/* Vintage photo frame effect */}
                <div className="relative aspect-[4/3] overflow-hidden frame-vintage rounded-sm lg:aspect-[4/5]">
                  {/* Sepia/vintage overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/20 via-transparent to-black/30 pointer-events-none mix-blend-multiply" />

                  {/* Edge darkening */}
                  <div className="absolute inset-0 z-10 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)] pointer-events-none" />

                  <Media
                    fill
                    imgClassName="object-cover"
                    priority
                    resource={media}
                    videoClassName="h-full w-full object-cover"
                  />
                </div>

                {/* Caption-style label below image */}
                <div className="mt-4 flex items-center justify-center gap-3 text-label-sm uppercase tracking-stamp-wide text-white/40">
                  <span className="h-px w-12 bg-current opacity-40" />
                  <span className="font-mono">Central Oregon</span>
                  <span className="ornament-diamond opacity-60" />
                  <span className="font-mono">Est. 2018</span>
                  <span className="h-px w-12 bg-current opacity-40" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
