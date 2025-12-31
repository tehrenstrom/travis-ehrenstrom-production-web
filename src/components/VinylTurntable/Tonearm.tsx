'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

interface TonearmProps {
  isPlaying: boolean
  currentTrack: number
  totalTracks: number
  trackProgress: number // 0-1 progress within current track
  className?: string
}

export const Tonearm: React.FC<TonearmProps> = ({
  isPlaying,
  currentTrack,
  totalTracks,
  trackProgress,
  className,
}) => {
  // Calculate tonearm rotation based on track and progress
  // Resting: -35deg (off record)
  // Track 1 outer: 0deg
  // Track N inner: up to 25deg
  // Within each track zone, sweep an additional 0-3deg based on progress
  
  const getRotation = () => {
    if (!isPlaying && currentTrack === 0) {
      return -35 // Resting position
    }
    
    // Base rotation per track (spread across 25 degrees total)
    const trackSpread = 25
    const baseRotation = ((currentTrack - 1) / Math.max(totalTracks - 1, 1)) * trackSpread
    
    // Progress sweep within track (additional 0-3 degrees)
    const progressSweep = trackProgress * 3
    
    return baseRotation + progressSweep
  }

  const rotation = getRotation()

  return (
    <div
      className={cn(
        'tonearm pointer-events-none z-20',
        'transition-transform duration-700 ease-out',
        className,
      )}
      style={{
        position: 'absolute',
        top: '0%',
        right: '5%',
        width: '80%',
        height: '90%',
        transformOrigin: 'top right',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        viewBox="0 0 200 300"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
      >
        {/* Pivot base */}
        <circle
          cx="180"
          cy="20"
          r="18"
          className="fill-zinc-700"
        />
        <circle
          cx="180"
          cy="20"
          r="12"
          className="fill-zinc-800"
        />
        <circle
          cx="180"
          cy="20"
          r="6"
          className="fill-zinc-600"
        />

        {/* Main arm */}
        <path
          d="M 178 30 
             L 160 50 
             L 45 250 
             L 35 260 
             L 30 258 
             L 40 248 
             L 155 48 
             L 175 28"
          className="fill-zinc-600"
        />
        
        {/* Arm highlight */}
        <path
          d="M 175 32 
             L 158 50 
             L 48 245"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
          fill="none"
        />

        {/* Counterweight */}
        <ellipse
          cx="175"
          cy="55"
          rx="8"
          ry="12"
          className="fill-zinc-500"
        />

        {/* Headshell */}
        <path
          d="M 35 258 
             L 25 268 
             L 15 275 
             L 10 273 
             L 20 265 
             L 30 255"
          className="fill-zinc-500"
        />

        {/* Cartridge */}
        <rect
          x="8"
          y="270"
          width="12"
          height="8"
          rx="1"
          className="fill-zinc-400"
        />

        {/* Stylus/Needle */}
        <path
          d="M 12 278 L 14 290 L 16 278"
          className="fill-zinc-300"
        />
        
        {/* Needle tip glow when playing */}
        {isPlaying && (
          <circle
            cx="14"
            cy="290"
            r="3"
            className="fill-accent animate-pulse"
            style={{ opacity: 0.6 }}
          />
        )}
      </svg>
    </div>
  )
}

export default Tonearm

