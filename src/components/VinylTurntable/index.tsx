'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { VinylDisc } from './VinylDisc'
import { Tonearm } from './Tonearm'

interface Track {
  title: string
  duration?: string | null
  id?: string | null
}

interface VinylTurntableProps {
  coverArt: Media
  title: string
  bandcampEmbedUrl: string
  tracklist: Track[]
  className?: string
}

export const VinylTurntable: React.FC<VinylTurntableProps> = ({
  coverArt,
  title,
  bandcampEmbedUrl,
  tracklist,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [trackProgress, setTrackProgress] = useState(0)
  const [isSleeveOut, setIsSleeveOut] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Size responsive - base size that scales
  const [size, setSize] = useState(450)

  useEffect(() => {
    const updateSize = () => {
      // Responsive sizing based on viewport
      const vw = window.innerWidth
      if (vw < 640) {
        setSize(Math.min(vw - 48, 380))
      } else if (vw < 1024) {
        setSize(450)
      } else {
        setSize(520)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Simulate track progress (since we can't easily get Bandcamp progress)
  useEffect(() => {
    if (isPlaying && currentTrack > 0) {
      // Parse track duration for more accurate simulation
      const track = tracklist[currentTrack - 1]
      const durationStr = track?.duration
      let totalSeconds = 180 // Default 3 minutes

      if (durationStr) {
        const parts = durationStr.split(':')
        if (parts.length === 2) {
          totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
      }

      // Update progress every second
      const increment = 1 / totalSeconds
      progressIntervalRef.current = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 1) {
            // Move to next track
            if (currentTrack < tracklist.length) {
              setCurrentTrack((t) => t + 1)
              return 0
            } else {
              // Album finished
              setIsPlaying(false)
              setCurrentTrack(0)
              return 0
            }
          }
          return prev + increment
        })
      }, 1000)

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }
    }
  }, [isPlaying, currentTrack, tracklist])

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      setIsSleeveOut(true)
      if (currentTrack === 0) {
        setCurrentTrack(1)
        setTrackProgress(0)
      }
    }
  }, [isPlaying, currentTrack])

  const handleNext = useCallback(() => {
    if (currentTrack < tracklist.length) {
      setCurrentTrack((prev) => prev + 1)
      setTrackProgress(0)
      setIsPlaying(true)
      setIsSleeveOut(true)
    }
  }, [currentTrack, tracklist.length])

  const handlePrevious = useCallback(() => {
    if (currentTrack > 1) {
      setCurrentTrack((prev) => prev - 1)
      setTrackProgress(0)
      setIsPlaying(true)
      setIsSleeveOut(true)
    }
  }, [currentTrack])

  return (
    <div className={cn('vinyl-turntable relative', className)}>
      {/* Hidden Bandcamp iframe for audio */}
      {bandcampEmbedUrl && (
        <iframe
          ref={iframeRef}
          src={bandcampEmbedUrl}
          className="sr-only"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: 'none',
          }}
          title={`${title} audio player`}
          allow="autoplay"
        />
      )}

      {/* Turntable container - sleeve on left, record slides out to right */}
      <div
        className="relative mx-auto"
        style={{
          width: isSleeveOut ? size * 1.6 + 80 : size + 80, // Expand when record slides out
          height: size + 40,
          transition: 'width 0.7s ease-out',
        }}
      >
        {/* Album sleeve (stays in place on the left) */}
        <div
          className={cn(
            'absolute transition-all duration-700 ease-out',
            'rounded-lg shadow-2xl overflow-hidden',
          )}
          style={{
            width: size,
            height: size,
            left: 0,
            top: 20,
            zIndex: 10,
          }}
        >
          {coverArt.url && (
            <img
              src={coverArt.url}
              alt={`${title} album sleeve`}
              className="w-full h-full object-cover"
              style={{
                filter: 'brightness(0.95) contrast(1.02)',
              }}
            />
          )}
          {/* Sleeve opening edge on right side */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: 'inset -8px 0 20px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.1)',
            }}
          />
          {/* Play button overlay on sleeve when not playing */}
          {!isSleeveOut && (
            <button
              onClick={handlePlayPause}
              className={cn(
                'absolute z-20 rounded-full',
                'flex items-center justify-center',
                'bg-black/50 backdrop-blur-sm',
                'border-2 border-white/30',
                'transition-all duration-300',
                'hover:bg-black/70 hover:border-accent/50 hover:scale-110',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
              )}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: size * 0.2,
                height: size * 0.2,
              }}
              aria-label="Play"
            >
              <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 fill-white ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Vinyl disc container - slides out from behind sleeve to the right */}
        <div
          className="absolute transition-all duration-700 ease-out"
          style={{
            left: isSleeveOut ? size * 0.55 : size * 0.05, // Slide out to the right
            top: 20,
            zIndex: isSleeveOut ? 5 : 1, // Behind sleeve when inside
          }}
        >
          <VinylDisc coverArt={coverArt} isPlaying={isPlaying} size={size} />

          {/* Play/Pause button on record when it's out */}
          {isSleeveOut && (
            <button
              onClick={handlePlayPause}
              className={cn(
                'absolute z-20 rounded-full',
                'flex items-center justify-center',
                'bg-black/40 backdrop-blur-sm',
                'border-2 border-white/20',
                'transition-all duration-300',
                'hover:bg-black/60 hover:border-accent/50 hover:scale-110',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                isPlaying && 'opacity-0 hover:opacity-100',
              )}
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: size * 0.12,
                height: size * 0.12,
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 fill-white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 fill-white ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Tonearm - positioned relative to the record */}
        <div
          className="absolute transition-all duration-700 ease-out"
          style={{
            right: isSleeveOut ? 0 : -size * 0.4,
            top: 0,
            width: size * 0.6,
            height: size + 40,
            pointerEvents: 'none',
          }}
        >
          <Tonearm
            isPlaying={isPlaying}
            currentTrack={currentTrack}
            totalTracks={tracklist.length}
            trackProgress={trackProgress}
          />
        </div>
      </div>

      {/* Current track indicator with next/back controls */}
      {isSleeveOut && currentTrack > 0 && tracklist[currentTrack - 1] && (
        <div className="mt-6 text-center animate-fade-in">
          <p className="text-label uppercase tracking-stamp text-muted-foreground">Now Playing</p>
          <p className="mt-1 font-display text-lg">
            {currentTrack}. {tracklist[currentTrack - 1].title}
          </p>

          {/* Next/Back buttons */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentTrack === 1}
              className={cn(
                'rounded-full p-2 transition-all duration-200',
                'border-2 border-foreground/20 bg-card/50 backdrop-blur-sm',
                'hover:border-accent/50 hover:bg-accent/10',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-foreground/20 disabled:hover:bg-card/50',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
              )}
              aria-label="Previous track"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={currentTrack === tracklist.length}
              className={cn(
                'rounded-full p-2 transition-all duration-200',
                'border-2 border-foreground/20 bg-card/50 backdrop-blur-sm',
                'hover:border-accent/50 hover:bg-accent/10',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-foreground/20 disabled:hover:bg-card/50',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
              )}
              aria-label="Next track"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-foreground">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VinylTurntable
