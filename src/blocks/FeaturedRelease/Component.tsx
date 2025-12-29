import React from 'react'

import type {
  FeaturedReleaseBlock as FeaturedReleaseBlockProps,
  Release,
  Media as MediaType,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const FeaturedReleaseBlock: React.FC<
  FeaturedReleaseBlockProps & {
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
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 rounded-[32px] border border-foreground/10 bg-card/80 p-6 shadow-[0_28px_70px_-48px_rgba(0,0,0,0.6)] backdrop-blur md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full border border-foreground/10 bg-background/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Featured Release
            </div>
            {title && <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{title}</h2>}
            {description && (
              <div className="mt-4 max-w-2xl">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
                {links.map((link, index) => (
                  <a
                    className="rounded-full border border-foreground/10 bg-background/70 px-4 py-2 text-foreground/80 transition hover:-translate-y-0.5 hover:text-foreground"
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
              <div className="mt-8">
                <CMSLink appearance="default" size="lg" {...ctaLink} />
              </div>
            )}
            {embedUrl && (
              <div className="mt-8 rounded-3xl border border-border bg-background/80 p-4">
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
          <div className="order-1 lg:order-2">
            {cover && typeof cover === 'object' && (
              <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-border bg-background/60 shadow-2xl">
                <Media fill imgClassName="object-cover" resource={cover} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
