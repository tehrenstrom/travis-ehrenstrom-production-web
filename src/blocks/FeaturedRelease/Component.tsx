import React from 'react'

import type {
  FeaturedReleaseBlock as FeaturedReleaseBlockProps,
  Release,
  Media as MediaType,
} from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

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
    <section data-theme="dark" className="teb-grain bg-background py-16 text-foreground md:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          {/* Album art side */}
          {cover && typeof cover === 'object' && (
            <div className="relative aspect-square w-full overflow-hidden rounded-md">
              <Media fill imgClassName="object-cover" resource={cover} />
            </div>
          )}

          {/* Content side */}
          <div>
            {/* Kicker */}
            <p className="font-mono text-label uppercase text-accent">
              Featured release · Now available
            </p>

            {/* Title */}
            {title && (
              <h2 className="mt-4 font-display font-extrabold tracking-display text-display-md md:text-display-lg">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <div className="mt-4 max-w-2xl text-muted-foreground">
                <RichText data={description} enableGutter={false} enableProse={false} />
              </div>
            )}

            {/* Streaming links */}
            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {links.map((link, index) => (
                  <a
                    className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 font-mono text-label-sm uppercase transition-colors duration-fast ease-teb-out hover:border-foreground/35 hover:bg-secondary"
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

            {/* CTA Button */}
            {ctaLink?.url && (
              <div className="mt-8">
                <CMSLink appearance="accent" size="lg" {...ctaLink} />
              </div>
            )}

            {/* Embed */}
            {embedUrl && (
              <div className="mt-8 rounded-md border border-border bg-card p-4">
                <iframe
                  className="min-h-[180px] w-full"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  src={embedUrl}
                  title={title || 'Featured release'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
