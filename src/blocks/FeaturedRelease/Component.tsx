import React from 'react'

import type { FeaturedReleaseBlock, Release, Media as MediaType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const FeaturedReleaseBlock: React.FC<
  FeaturedReleaseBlock & {
    id?: string
  }
> = ({ ctaLink, embedUrl, media, overrideDescription, overrideTitle, release }) => {
  const releaseDoc = typeof release === 'object' && release !== null ? (release as Release) : null
  const title = overrideTitle || releaseDoc?.title
  const description = overrideDescription || releaseDoc?.description
  const cover = (media || releaseDoc?.coverArt) as MediaType | null | undefined
  const links = releaseDoc?.links?.filter((link) => Boolean(link?.label && link?.url)) ?? []

  return (
    <section className="container">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div className="space-y-6">
          {cover && typeof cover === 'object' && (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
              <Media fill imgClassName="object-cover" resource={cover} />
            </div>
          )}
          {embedUrl && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <iframe
                className={cn('w-full min-h-[180px]')}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                src={embedUrl}
                title={title || 'Featured release'}
              />
            </div>
          )}
        </div>
        <div>
          {title && <h2 className="text-3xl font-semibold">{title}</h2>}
          {description && (
            <div className="mt-4">
              <RichText data={description} enableGutter={false} />
            </div>
          )}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {links.map((link, index) => (
                <a
                  className="underline"
                  href={link?.url as string}
                  key={`${releaseDoc?.id ?? 'release'}-${index}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link?.label}
                </a>
              ))}
            </div>
          )}
          {ctaLink?.url && (
            <div className="mt-6">
              <CMSLink {...ctaLink} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
