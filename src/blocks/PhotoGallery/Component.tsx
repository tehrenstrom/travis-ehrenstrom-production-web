import React from 'react'

import type { PhotoGalleryBlock as PhotoGalleryBlockProps, Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const PhotoGalleryBlock: React.FC<PhotoGalleryBlockProps> = async ({
  heading,
  subheading,
  populateBy,
  photos: selectedPhotos,
  maxPhotos,
  layout = 'scroll',
}) => {
  let photos: Media[] = []

  if (populateBy === 'pressPhotos') {
    // Fetch press photos from collection
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'media',
      where: {
        isPressPhoto: { equals: true },
      },
      limit: maxPhotos ?? 20,
      sort: '-createdAt',
    })
    photos = result.docs as Media[]
  } else if (selectedPhotos && selectedPhotos.length > 0) {
    // Use manually selected photos
    photos = selectedPhotos.filter((photo): photo is Media => typeof photo === 'object')
  }

  if (photos.length === 0) {
    return null
  }

  const isScrollLayout = layout === 'scroll'

  return (
    <section className="container my-16">
      <div
        className="vintage-card p-6 md:p-10 opacity-0 animate-reveal"
        style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
      >
        {/* Header */}
        {(heading || subheading) && (
          <div className="mb-8">
            {subheading && (
              <div className="flex items-center gap-3 mb-3">
                <span className="ornament-star text-accent/50" />
                <span className="text-label uppercase tracking-stamp-wide text-muted-foreground">
                  {subheading}
                </span>
              </div>
            )}
            {heading && (
              <h2 className="font-display text-display-sm md:text-display-md">{heading}</h2>
            )}
          </div>
        )}

        {/* Gallery */}
        {isScrollLayout ? (
          <div className="relative -mx-6 md:-mx-10">
            {/* Scroll container */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 px-6 md:px-10 pb-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={cn(
                      'flex-shrink-0 opacity-0 animate-fade-up',
                      'w-64 md:w-80',
                    )}
                    style={{
                      animationDelay: `${200 + index * 50}ms`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <div className="frame-vintage overflow-hidden group cursor-pointer">
                      <div className="relative aspect-[4/3]">
                        {/* Vintage overlay */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/10 via-transparent to-black/15 pointer-events-none transition-opacity group-hover:opacity-50" />
                        <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] pointer-events-none" />
                        <MediaComponent
                          fill
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                          resource={photo}
                        />
                      </div>
                    </div>
                    {photo.alt && (
                      <p className="mt-2 text-xs text-muted-foreground/60 text-center truncate">
                        {photo.alt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll hint gradient */}
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-card to-transparent pointer-events-none" />
          </div>
        ) : (
          /* Grid layout */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${200 + index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="frame-vintage overflow-hidden group cursor-pointer">
                  <div className="relative aspect-square">
                    {/* Vintage overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-br from-amber-900/10 via-transparent to-black/15 pointer-events-none transition-opacity group-hover:opacity-50" />
                    <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] pointer-events-none" />
                    <MediaComponent
                      fill
                      imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                      resource={photo}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer decoration */}
        <div className="flex items-center justify-center mt-8">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
          <span className="ornament-diamond mx-4 text-accent/40" />
          <span className="text-label-sm uppercase tracking-stamp text-muted-foreground/50">
            {photos.length} Photos
          </span>
          <span className="ornament-diamond mx-4 text-accent/40" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </section>
  )
}

