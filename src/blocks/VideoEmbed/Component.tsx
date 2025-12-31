'use client'

import React, { useState } from 'react'

import type { VideoEmbedBlock as VideoEmbedBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

type Video = NonNullable<VideoEmbedBlockProps['videos']>[number]

const YouTubeEmbed: React.FC<{ videoId: string; title?: string | null }> = ({ videoId, title }) => {
  return (
    <div className="relative aspect-video w-full overflow-hidden frame-vintage">
      <div className="absolute inset-0 z-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.15)] pointer-events-none" />
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title || 'YouTube video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

const VideoThumbnail: React.FC<{
  video: Video
  isActive?: boolean
  onClick: () => void
}> = ({ video, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-sm transition-all',
        'hover:ring-2 hover:ring-accent/50',
        isActive && 'ring-2 ring-accent',
      )}
    >
      <img
        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
        alt={video.title || 'Video thumbnail'}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/20">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
          <svg className="w-3 h-3 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {video.title && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-xs text-white truncate">{video.title}</p>
        </div>
      )}
    </button>
  )
}

export const VideoEmbedBlock: React.FC<VideoEmbedBlockProps> = ({
  heading,
  subheading,
  videos,
  layout = 'featured',
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!videos || videos.length === 0) {
    return null
  }

  const activeVideo = videos[activeIndex]
  const isFeaturedLayout = layout === 'featured'

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

        {isFeaturedLayout ? (
          <div className="space-y-6">
            {/* Main video */}
            <div
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              <YouTubeEmbed
                videoId={activeVideo?.youtubeId || ''}
                title={activeVideo?.title}
              />
              {activeVideo?.title && (
                <div className="mt-4">
                  <h3 className="font-display text-lg">{activeVideo.title}</h3>
                  {activeVideo.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{activeVideo.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {videos.length > 1 && (
              <div
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {videos.map((video, index) => (
                    <VideoThumbnail
                      key={video.id || index}
                      video={video}
                      isActive={index === activeIndex}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid layout */
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((video, index) => (
              <div
                key={video.id || index}
                className="opacity-0 animate-fade-up"
                style={{
                  animationDelay: `${200 + index * 100}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
                {video.title && (
                  <div className="mt-3">
                    <h3 className="font-display text-base">{video.title}</h3>
                    {video.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{video.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

