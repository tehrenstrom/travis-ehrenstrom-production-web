'use client'

import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/ui'

interface VinylDiscProps {
  coverArt: Media
  isPlaying: boolean
  size?: number
  className?: string
}

export const VinylDisc: React.FC<VinylDiscProps> = ({
  coverArt,
  isPlaying,
  size = 500,
  className,
}) => {
  const imageUrl = coverArt.url || coverArt.thumbnailURL || ''
  const altText = coverArt.alt || 'Album cover'

  return (
    <div
      className={cn(
        'vinyl-disc relative rounded-full overflow-hidden',
        isPlaying && 'vinyl-disc--playing',
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Vinyl base - black with grooves */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-black to-zinc-800 shadow-2xl overflow-hidden">
        {/* Groove texture overlay - more visible for realistic vinyl */}
        <div className="vinyl-grooves absolute inset-0 rounded-full opacity-50" />

        {/* Vinyl sheen/reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
      </div>

      {/* Center label - traditional vinyl style (35% of vinyl) */}
      <div
        className="absolute rounded-full overflow-hidden shadow-inner border-2 border-zinc-700/50"
        style={{
          top: '32.5%',
          left: '32.5%',
          width: '35%',
          height: '35%',
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-cover"
            sizes={`${Math.round(size * 0.35)}px`}
            priority
          />
        )}

        {/* Subtle overlay for label feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/15" />
      </div>

      {/* Center spindle hole */}
      <div
        className="absolute rounded-full bg-zinc-900 shadow-inner border-2 border-zinc-600"
        style={{
          top: '50%',
          left: '50%',
          width: '4%',
          height: '4%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Inner spindle detail */}
        <div className="absolute inset-0.5 rounded-full bg-zinc-700" />
      </div>

      {/* Light reflection for 3D effect - clipped to disc */}
      <div
        className="absolute rounded-full pointer-events-none overflow-hidden"
        style={{
          top: '8%',
          left: '15%',
          width: '25%',
          height: '12%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
          filter: 'blur(6px)',
          clipPath: 'circle(50% at 50% 50%)',
        }}
      />
    </div>
  )
}

export default VinylDisc
