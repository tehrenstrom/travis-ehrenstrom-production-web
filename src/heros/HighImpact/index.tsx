'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <section className="relative -mt-[10.4rem] overflow-hidden text-white" data-theme="dark">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black/90" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      <div className="container relative z-10 grid gap-12 pb-20 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-40">
        <div className="order-2 lg:order-1">
          {richText && (
            <RichText
              className="mb-8 max-w-2xl prose-invert prose-h1:text-4xl md:prose-h1:text-5xl md:prose-h2:text-2xl"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {links.map(({ link }, i) => {
                const isPrimary = i === 0
                const delayClass = isPrimary ? 'delay-100' : 'delay-200'
                return (
                  <li
                    className={`animate-in fade-in slide-in-from-bottom-4 duration-700 ${delayClass}`}
                    key={i}
                  >
                    <CMSLink
                      {...link}
                      appearance={isPrimary ? 'default' : 'outline'}
                      className={
                        isPrimary ? '' : 'border-white/40 bg-transparent text-white hover:bg-white/10'
                      }
                      size="lg"
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div className="order-1 lg:order-2">
          {media && typeof media === 'object' && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-white/10 bg-black/20 shadow-2xl lg:aspect-[4/5]">
              <Media
                fill
                imgClassName="object-cover"
                priority
                resource={media}
                videoClassName="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
