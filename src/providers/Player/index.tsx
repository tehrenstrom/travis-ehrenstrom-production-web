'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

/**
 * A single "now playing" entry. Audio is served by Bandcamp, so the only data we
 * need to render the embed is the album's `bandcampId` plus an optional 1-based
 * `trackNum` (Bandcamp's `t=` deep-link). The rest is metadata for the bar UI.
 */
export type NowPlaying = {
  releaseId: string
  /** Track title when a specific track is playing, otherwise the release title. */
  title: string
  /** Parent release name, shown as the sub-line. */
  releaseTitle: string
  /** Resolved cover image URL (built server-side via getMediaUrl). */
  coverUrl: string
  /** Bandcamp album id — required; without it there is nothing to play. */
  bandcampId: string
  /** 1-based Bandcamp track index, appended as `t=<n>` when present. */
  trackNum?: number
}

export interface PlayerContextValue {
  nowPlaying: NowPlaying | null
  /** Set the now-playing entry. No-op when the same release + track is already active. */
  play: (next: NowPlaying) => void
  /** Clear playback and slide the bar away. */
  clear: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)

  const play = useCallback((next: NowPlaying) => {
    // Nothing to play without a Bandcamp id.
    if (!next.bandcampId) return
    setNowPlaying((current) => {
      // Avoid a needless iframe reload when re-selecting the active track.
      if (
        current &&
        current.releaseId === next.releaseId &&
        (current.trackNum ?? null) === (next.trackNum ?? null)
      ) {
        return current
      }
      return next
    })
  }, [])

  const clear = useCallback(() => setNowPlaying(null), [])

  const value = useMemo<PlayerContextValue>(
    () => ({ nowPlaying, play, clear }),
    [nowPlaying, play, clear],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = (): PlayerContextValue => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
