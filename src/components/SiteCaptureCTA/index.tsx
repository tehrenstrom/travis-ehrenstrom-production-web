'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import { CaptureForm } from '@/components/CaptureForm'

/**
 * Renders the list-capture form near the bottom of every page (above the footer),
 * making the primary site-wide action reachable in <=1 click everywhere.
 *
 * Suppressed on routes that already lead with a capture form so we don't show it
 * twice. The QR/merch landing page (/mailing-list) is one of those — its URL is
 * preserved for active QR campaigns and it remains the dedicated capture page.
 */

// Home renders its own captureForm block (sunset band), so it's suppressed too.
const SUPPRESS_ON = new Set<string>(['/', '/mailing-list', '/contact', '/house-concerts'])

export const SiteCaptureCTA: React.FC = () => {
  const pathname = usePathname()

  if (pathname && SUPPRESS_ON.has(pathname)) return null

  return (
    <section className="container py-16">
      <CaptureForm
        heading="Stay in the loop"
        intro="Every show and every song lands here first. If you want to know when we're playing near you, this is the spot. I'd love to have you."
        placement="footer_cta"
      />
    </section>
  )
}

export default SiteCaptureCTA
