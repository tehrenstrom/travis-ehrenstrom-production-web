'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const HighImpactHero: React.FC<Page['hero']> = ({
  kicker,
  links,
  media,
  note,
  richText,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section
      className="teb-sunset teb-grain relative min-h-[92svh] overflow-hidden"
      data-theme="dark"
    >
      {/* Background photo over the sunset base */}
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

      {/* Sepia protection gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-sepia-900/85 via-sepia-900/30 to-transparent" />

      {/* Main content */}
      <div className="container relative z-10 flex min-h-[92svh] flex-col justify-end pb-20 pt-32">
        <div className="max-w-4xl">
          {/* Kicker */}
          {kicker && (
            <div
              className="mb-6 opacity-0 animate-fade-up"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <p className="font-mono text-label uppercase text-accent">{kicker}</p>
            </div>
          )}

          {richText && (
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <RichText
                className={cn(
                  'mb-10 prose-invert',
                  // H1: stretched display, uppercase
                  'prose-h1:font-display prose-h1:uppercase prose-h1:font-extrabold prose-h1:tracking-display',
                  'prose-h1:text-[clamp(3rem,8vw,6.5rem)] prose-h1:leading-[1.02] prose-h1:text-oat-50',
                  'prose-h1:text-balance',
                  // H2: subtitle style
                  'prose-h2:font-sans prose-h2:font-normal prose-h2:text-oat-100/80 prose-h2:text-xl',
                  'prose-h2:mt-0 prose-h2:mb-1',
                  'md:prose-h2:text-2xl',
                  // Paragraphs
                  'prose-p:text-oat-100/70 prose-p:text-lg prose-p:max-w-xl',
                )}
                data={richText}
                enableGutter={false}
              />
            </div>
          )}

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
                      appearance={isPrimary ? 'default' : 'secondary'}
                      className="min-w-[180px] justify-center"
                      size="lg"
                    />
                  </li>
                )
              })}
            </ul>
          )}

          {/* Reassurance note under the CTAs */}
          {note && (
            <p
              className="mt-5 font-mono text-2xs text-oat-100/60 opacity-0 animate-fade-up"
              style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
            >
              {note}
            </p>
          )}
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <span className="font-mono text-label-sm uppercase text-oat-100/40">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-oat-100/30 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}
