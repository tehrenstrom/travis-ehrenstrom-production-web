import { cn } from '@/utilities/ui'
import React from 'react'

interface IconProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

// Hand-drawn style SVG icons with organic, sketchy strokes
export const DiamondIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Slightly imperfect diamond shape */}
    <path d="M12 2.5c.3.2 6.8 8.2 7.2 9-.4.8-6.9 9.3-7.2 9.5-.3-.2-6.8-8.7-7.2-9.5.4-.8 6.9-8.8 7.2-9z" />
    <path d="M5 12h14" strokeWidth="1" opacity="0.4" />
  </svg>
)

export const SpadeIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Organic spade with hand-drawn feel */}
    <path d="M12 3c-1 2-5.5 6-6 9 0 2.5 2 4.5 4.5 4.5.8 0 1.5-.2 2-.5-.3 1.5-.8 3-1.5 4.5h6c-.7-1.5-1.2-3-1.5-4.5.5.3 1.2.5 2 .5 2.5 0 4.5-2 4.5-4.5-.5-3-5-7-6-9z" />
  </svg>
)

export const CloverIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Three-leaf clover with organic curves */}
    <circle cx="12" cy="7" r="3.5" />
    <circle cx="7.5" cy="12.5" r="3.5" />
    <circle cx="16.5" cy="12.5" r="3.5" />
    <path d="M12 14c-.2 2-.5 4-1 6h2c-.5-2-.8-4-1-6z" />
  </svg>
)

export const HeartIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Slightly asymmetric hand-drawn heart */}
    <path d="M12 21c-.5-.3-8-5.5-8.5-10.5 0-3 2.2-5.5 5-5.5 1.8 0 3 1 3.5 1.8.5-.8 1.7-1.8 3.5-1.8 2.8 0 5 2.5 5 5.5-.5 5-8 10.2-8.5 10.5z" />
  </svg>
)

export const MountainIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Cascades-style mountain range with hand-drawn peaks */}
    <path d="M3 19l5.5-8c.3-.4.8-.6 1.2-.4l2.3 1.5 4-7c.3-.5 1-.5 1.3 0l5.7 10" />
    <path d="M3 19h18" />
    {/* Snow cap suggestion */}
    <path d="M15.5 7l1.5 2.5-1 .5" strokeWidth="1" opacity="0.5" />
  </svg>
)

export const FlowerIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Six-petal flower with organic petals */}
    <circle cx="12" cy="12" r="2.5" />
    <ellipse cx="12" cy="6" rx="2" ry="3" />
    <ellipse cx="17" cy="9" rx="2" ry="3" transform="rotate(60 17 9)" />
    <ellipse cx="17" cy="15" rx="2" ry="3" transform="rotate(120 17 15)" />
    <ellipse cx="12" cy="18" rx="2" ry="3" />
    <ellipse cx="7" cy="15" rx="2" ry="3" transform="rotate(60 7 15)" />
    <ellipse cx="7" cy="9" rx="2" ry="3" transform="rotate(120 7 9)" />
  </svg>
)

export const RiverIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Flowing river with organic curves */}
    <path d="M4 6c2-1 4 1 6 0s4-2 6 0 4 1 6 0" />
    <path d="M4 12c2-1 4 1 6 0s4-2 6 0 4 1 6 0" />
    <path d="M4 18c2-1 4 1 6 0s4-2 6 0 4 1 6 0" />
  </svg>
)

export const SunIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Hand-drawn sun with organic rays */}
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3" />
    <path d="M12 19v3" />
    <path d="M4.22 4.22l2.12 2.12" />
    <path d="M17.66 17.66l2.12 2.12" />
    <path d="M2 12h3" />
    <path d="M19 12h3" />
    <path d="M4.22 19.78l2.12-2.12" />
    <path d="M17.66 6.34l2.12-2.12" />
  </svg>
)

export const StarIcon: React.FC<IconProps> = ({ className, size = 'md' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn(sizeMap[size], className)}
  >
    {/* Four-point star, slightly organic */}
    <path d="M12 2l2 7h7l-5.5 4.5 2 7-5.5-4-5.5 4 2-7L3 9h7z" />
  </svg>
)

// Decorative divider component using the icons
export const OrganicDivider: React.FC<{
  className?: string
  variant?: 'mountain' | 'river' | 'cards' | 'nature'
}> = ({ className, variant = 'nature' }) => {
  const icons = {
    mountain: [MountainIcon, RiverIcon, MountainIcon],
    river: [RiverIcon],
    cards: [DiamondIcon, SpadeIcon, HeartIcon, CloverIcon],
    nature: [FlowerIcon, SunIcon, FlowerIcon],
  }

  const IconSet = icons[variant]

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-border rounded-full" />
      {IconSet.map((Icon, i) => (
        <Icon key={i} size="sm" className="text-accent" />
      ))}
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-border rounded-full" />
    </div>
  )
}

