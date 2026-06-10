'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

import { usePlayer } from '@/providers/Player'
import { cn } from '@/utilities/ui'

/**
 * Build the Bandcamp embed URL for the bar. We use the compact `size=small`
 * player (a ~42px-tall horizontal transport) tinted to the dusk palette so it
 * blends into the dark bar. A specific track is deep-linked with `t=<n>`.
 *
 * Bandcamp embeds are cross-origin and cannot be driven by JS, so this iframe
 * *is* the transport — there are no custom play/seek/volume controls.
 */
const buildEmbedUrl = (bandcampId: string, trackNum?: number) => {
  const base = `https://bandcamp.com/EmbeddedPlayer/album=${bandcampId}/size=small/bgcol=261f13/linkcol=faf3e2/tracklist=false/transparent=true/`
  return trackNum ? `${base}t=${trackNum}/` : base
}

export const StickyPlayer: React.FC = () => {
  const { nowPlaying, clear } = usePlayer()

  // Reserve space at the bottom of the page so the fixed bar never hides
  // footer links or page content while it's open.
  useEffect(() => {
    document.body.style.paddingBottom = nowPlaying ? '78px' : ''
    return () => {
      document.body.style.paddingBottom = ''
    }
  }, [nowPlaying])

  return (
    <div
      aria-hidden={!nowPlaying}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 transition-transform duration-[350ms] ease-teb-out',
        nowPlaying ? 'translate-y-0' : 'translate-y-full',
      )}
      role="region"
      aria-label="Audio player"
    >
      <div className="border-t border-sepia-700 bg-sepia-900/95 text-oat-50 shadow-lg backdrop-blur-[14px]">
        <div className="container flex items-center gap-4 py-2.5">
          {nowPlaying && (
            <>
              {/* Cover */}
              <div className="h-[46px] w-[46px] flex-none overflow-hidden rounded-sm bg-sepia-800">
                {nowPlaying.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    src={nowPlaying.coverUrl}
                  />
                ) : null}
              </div>

              {/* Metadata */}
              <div className="hidden min-w-0 min-[480px]:block">
                <div className="truncate font-display font-semibold text-oat-50">
                  {nowPlaying.title}
                </div>
                <div className="truncate font-mono text-[11px] uppercase tracking-[0.06em] text-sepia-400">
                  {nowPlaying.releaseTitle}
                </div>
              </div>

              {/* Bandcamp transport (the actual audio + controls) */}
              <div className="min-w-[160px] flex-1">
                <iframe
                  key={`${nowPlaying.bandcampId}-${nowPlaying.trackNum ?? 0}`}
                  allow="autoplay"
                  className="block h-[42px] w-full border-0"
                  loading="lazy"
                  src={buildEmbedUrl(nowPlaying.bandcampId, nowPlaying.trackNum)}
                  title={`${nowPlaying.title} — Bandcamp player`}
                />
              </div>

              {/* Close */}
              <button
                aria-label="Close player"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-oat-100 transition-colors duration-fast ease-teb-out hover:bg-gold-400/15 hover:text-gold-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                onClick={clear}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StickyPlayer
