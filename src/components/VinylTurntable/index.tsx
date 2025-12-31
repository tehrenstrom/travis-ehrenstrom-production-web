'use client'

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
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
  const [selectedTrackNum, setSelectedTrackNum] = useState<number | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Build the Bandcamp URL with track selection
  const playerUrl = useMemo(() => {
    let url = bandcampEmbedUrl
      .replace('size=large', 'size=small')
      .replace('tracklist=true', 'tracklist=false')

    // Add track parameter if a specific track is selected
    if (selectedTrackNum !== null) {
      url += `t=${selectedTrackNum}/`
    }

    return url
  }, [bandcampEmbedUrl, selectedTrackNum])

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

  // Simulate track progress for tonearm animation when playing
  useEffect(() => {
    if (isPlaying && currentTrack > 0) {
      const track = tracklist[currentTrack - 1]
      const durationStr = track?.duration
      let totalSeconds = 180

      if (durationStr) {
        const parts = durationStr.split(':')
        if (parts.length === 2) {
          totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
      }

      const increment = 1 / totalSeconds
      progressIntervalRef.current = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 1) {
            if (currentTrack < tracklist.length) {
              setCurrentTrack((t) => t + 1)
              return 0
            } else {
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

  // Slide out the record to reveal the player
  const handleSlideOut = useCallback(() => {
    setIsSleeveOut(true)
    setIsPlaying(true)
    if (currentTrack === 0) {
      setCurrentTrack(1)
      setTrackProgress(0)
    }
  }, [currentTrack])

  // Toggle play state for vinyl animation
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Handle track selection from tracklist
  const handleTrackSelect = useCallback((trackNumber: number) => {
    setSelectedTrackNum(trackNumber)
    setCurrentTrack(trackNumber)
    setTrackProgress(0)
    setIsPlaying(true)
    setIsSleeveOut(true)
  }, [])

  return (
    <div className={cn('vinyl-turntable relative', className)}>
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
          {/* Play button overlay on sleeve to reveal record */}
          {!isSleeveOut && (
            <button
              onClick={handleSlideOut}
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

      {/* Bandcamp player - styled minimal player */}
      {bandcampEmbedUrl && isSleeveOut && (
        <div className="mt-8 flex justify-center animate-fade-in">
          <div
            className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm"
            style={{ maxWidth: '100%' }}
          >
            <iframe
              key={selectedTrackNum} // Force re-render when track changes
              src={playerUrl}
              className="border-0"
              style={{
                width: '400px',
                height: '42px',
                maxWidth: '100%',
              }}
              title={`${title} audio player`}
              allow="autoplay"
            />
          </div>
        </div>
      )}

      {/* Interactive Tracklist */}
      {tracklist.length > 0 && (
        <div className="mt-12 max-w-md mx-auto">
          <div className="text-center mb-6">
            <span className="text-label uppercase tracking-stamp text-muted-foreground">
              Tracklist
            </span>
          </div>
          <ol className="space-y-1">
            {tracklist.map((track, index) => {
              const trackNum = index + 1
              const isCurrentTrack = currentTrack === trackNum

              return (
                <li key={track.id || index}>
                  <button
                    onClick={() => handleTrackSelect(trackNum)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-lg',
                      'transition-all duration-200',
                      'hover:bg-accent/10 hover:pl-6',
                      'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
                      isCurrentTrack && isPlaying
                        ? 'bg-accent/20 border-l-4 border-accent pl-5'
                        : 'border-l-4 border-transparent',
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          'w-6 h-6 flex items-center justify-center rounded-full text-sm',
                          isCurrentTrack && isPlaying
                            ? 'bg-accent text-accent-foreground font-bold'
                            : 'text-muted-foreground',
                        )}
                      >
                        {isCurrentTrack && isPlaying ? (
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          trackNum
                        )}
                      </span>
                      <span
                        className={cn('font-medium', isCurrentTrack && isPlaying && 'text-accent')}
                      >
                        {track.title}
                      </span>
                    </div>
                    {track.duration && (
                      <span className="text-sm text-muted-foreground font-mono">
                        {track.duration}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </div>
  )
}

export default VinylTurntable
