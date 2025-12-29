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
      {heading && <h2 className="text-2xl font-semibold">{heading}</h2>}
      <div className="mt-4 flex flex-wrap gap-4">
        {links.map((link, index) => {
          if (!link?.url) return null
          return (
            <a
              className="text-sm uppercase tracking-[0.2em] underline underline-offset-4"
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
    </section>
  )
}
