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
      <div
        className={cn(
          'vintage-card p-6 md:p-10',
          'opacity-0 animate-reveal',
        )}
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Decorative top border */}
        <div className="flex items-center justify-center mb-8">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="ornament-star mx-4 text-accent/50" />
          <span className="h-px flex-1 bg-border" />
          <span className="ornament-star mx-4 text-accent/50" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Content side */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5',
                'text-label-sm uppercase tracking-stamp-wide',
                'border border-accent/30 bg-accent/5 text-accent',
              )}
            >
              <span className="ornament-diamond" />
              <span>Featured Release</span>
              <span className="ornament-diamond" />
            </div>

            {/* Title */}
            {title && (
              <h2 className="mt-5 font-display text-display-md md:text-display-lg">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <div className="mt-4 max-w-2xl text-muted-foreground">
                <RichText data={description} enableGutter={false} enableProse={false} />
              </div>
            )}

            {/* Streaming links as stamps */}
            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {links.map((link, index) => (
                  <a
                    className={cn(
                      'inline-flex items-center px-3 py-1.5',
                      'text-label-sm uppercase tracking-stamp',
                      'border border-border bg-card',
                      'shadow-vintage-inset transition-all duration-200',
                      'hover:shadow-vintage hover:-translate-y-0.5 hover:border-foreground/30',
                    )}
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
                <CMSLink appearance="default" size="lg" {...ctaLink} />
              </div>
            )}

            {/* Embed */}
            {embedUrl && (
              <div className="mt-8 vintage-card p-4">
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

          {/* Album art side */}
          <div className="order-1 lg:order-2">
            {cover && typeof cover === 'object' && (
              <div className="corners-poster">
                <div className="relative aspect-square w-full overflow-hidden frame-vintage">
                  {/* Vinyl/aged overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/10 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute inset-0 z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none" />
                  <Media fill imgClassName="object-cover" resource={cover} />
                </div>

                {/* Caption below album */}
                <div className="mt-4 flex items-center justify-center gap-3 text-label-sm uppercase tracking-stamp text-muted-foreground/60">
                  <span className="h-px w-8 bg-current opacity-40" />
                  <span className="font-mono">Now Available</span>
                  <span className="ornament-diamond opacity-60" />
                  <span className="font-mono">Stream & Download</span>
                  <span className="h-px w-8 bg-current opacity-40" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="flex items-center justify-center mt-8">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="ornament-diamond mx-4 text-accent/40" />
          <span className="h-px flex-1 bg-border" />
          <span className="ornament-diamond mx-4 text-accent/40" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </section>
  )
}
