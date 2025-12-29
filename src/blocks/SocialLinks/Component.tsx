import React from 'react'

import type { SocialLinksBlock as SocialLinksBlockProps } from '@/payload-types'

export const SocialLinksBlock: React.FC<
  SocialLinksBlockProps & {
    id?: string
  }
> = ({ heading, links }) => {
  if (!links || links.length === 0) return null

  return (
    <section className="container">
      <div className="rounded-[32px] border border-foreground/10 bg-card/80 p-6 shadow-[0_20px_50px_-36px_rgba(0,0,0,0.4)] backdrop-blur md:p-8">
        {heading && <h2 className="text-2xl font-semibold md:text-3xl">{heading}</h2>}
        <div className="mt-5 flex flex-wrap gap-3">
          {links.map((link, index) => {
            if (!link?.url) return null
            return (
              <a
                className="inline-flex items-center rounded-full border border-foreground/10 bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:-translate-y-0.5 hover:text-foreground"
                href={link.url}
                key={`${link.label ?? 'social'}-${index}`}
                rel={link.newTab ? 'noreferrer' : undefined}
                target={link.newTab ? '_blank' : undefined}
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
