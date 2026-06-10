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
      {/* Header */}
      {(heading || subheading) && (
        <div className="mb-8">
          {subheading && (
            <p className="mb-3 font-mono text-label uppercase text-primary">{subheading}</p>
          )}
          {heading && (
            <h2 className="font-display font-extrabold tracking-display text-display-sm md:text-display-md">
              {heading}
            </h2>
          )}
        </div>
      )}

      {/* Gallery */}
      {isScrollLayout ? (
        <div className="relative">
          {/* Scroll container */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={cn('flex-shrink-0 opacity-0 animate-fade-up', 'w-64 md:w-80')}
                  style={{
                    animationDelay: `${200 + index * 50}ms`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-md border border-border">
                    <MediaComponent
                      fill
                      imgClassName="object-cover transition duration-base ease-teb-out group-hover:brightness-105"
                      resource={photo}
                    />
                  </div>
                  {photo.alt && (
                    <p className="mt-2 truncate text-center font-mono text-2xs text-muted-foreground">
                      {photo.alt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scroll hint gradient */}
          <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-16 bg-gradient-to-l from-background to-transparent" />
        </div>
      ) : (
        /* Grid layout */
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="opacity-0 animate-fade-up"
              style={{
                animationDelay: `${200 + index * 50}ms`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="group relative aspect-square overflow-hidden rounded-md border border-border">
                <MediaComponent
                  fill
                  imgClassName="object-cover transition duration-base ease-teb-out group-hover:brightness-105"
                  resource={photo}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer count */}
      <p className="mt-8 text-center font-mono text-label-sm uppercase text-muted-foreground">
        {photos.length} photos
      </p>
    </section>
  )
}
