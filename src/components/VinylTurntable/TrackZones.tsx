'use client'

import React from 'react'
import { cn } from '@/utilities/ui'

interface Track {
  title: string
  duration?: string | null
}

interface TrackZonesProps {
  tracklist: Track[]
  currentTrack: number
  onTrackClick: (trackIndex: number) => void
  size: number
  className?: string
}

// Parse duration string "M:SS" to seconds
const parseDuration = (duration?: string | null): number => {
  if (!duration) return 180 // Default 3 minutes if not specified
  const parts = duration.split(':')
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
  }
  return 180
}

export const TrackZones: React.FC<TrackZonesProps> = ({
  tracklist,
  currentTrack,
  onTrackClick,
  size,
  className,
}) => {
  // Calculate zones - outer ring is track 1, inner rings are subsequent tracks
  // The vinyl edge takes up 7.5% on each side, so zones are within 85% of the disc
  // Center 15% is reserved for the album art center/spindle area
  
  const outerRadius = size / 2 * 0.925 // 92.5% of half-size (leaving edge)
  const innerLimit = size / 2 * 0.15 // 15% center reserved
  const availableRadius = outerRadius - innerLimit
  
  // Distribute zones based on track count (equal rings for simplicity)
  const zoneWidth = availableRadius / tracklist.length
  
  const zones = tracklist.map((track, index) => {
    const outer = outerRadius - (index * zoneWidth)
    const inner = outer - zoneWidth
    return {
      track,
      index: index + 1,
      outerRadius: outer,
      innerRadius: Math.max(inner, innerLimit),
    }
  })

  const center = size / 2

  return (
    <svg
      className={cn('absolute inset-0 z-10', className)}
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: size, height: size }}
    >
      <defs>
        {/* Gradient for hover effect */}
        <radialGradient id="zoneHoverGradient">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Gradient for active track */}
        <radialGradient id="zoneActiveGradient">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      {zones.map((zone) => {
        const isActive = currentTrack === zone.index
        const strokeWidth = zone.outerRadius - zone.innerRadius
        const midRadius = (zone.outerRadius + zone.innerRadius) / 2
        
        return (
          <g key={zone.index}>
            {/* Clickable ring */}
            <circle
              cx={center}
              cy={center}
              r={midRadius}
              fill="none"
              stroke={isActive ? 'url(#zoneActiveGradient)' : 'transparent'}
              strokeWidth={strokeWidth}
              className={cn(
                'cursor-pointer transition-all duration-300',
                'hover:stroke-[url(#zoneHoverGradient)]',
                !isActive && 'hover:opacity-100 opacity-0',
              )}
              style={{
                stroke: isActive ? 'hsl(var(--accent) / 0.3)' : undefined,
              }}
              onClick={() => onTrackClick(zone.index)}
            />
            
            {/* Hover overlay */}
            <circle
              cx={center}
              cy={center}
              r={midRadius}
              fill="none"
              stroke="hsl(var(--accent) / 0.2)"
              strokeWidth={strokeWidth}
              className="opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer pointer-events-none"
            />

            {/* Track number label (shown on hover via CSS) */}
            <text
              x={center}
              y={center - midRadius + strokeWidth / 2 + 4}
              textAnchor="middle"
              className="track-zone-label fill-accent text-xs font-bold opacity-0 pointer-events-none transition-opacity"
              style={{ fontSize: Math.max(10, strokeWidth * 0.4) }}
            >
              {zone.index}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default TrackZones

