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

const SUPPRESS_ON = new Set<string>(['/mailing-list'])

export const SiteCaptureCTA: React.FC = () => {
  const pathname = usePathname()

  if (pathname && SUPPRESS_ON.has(pathname)) return null

  return (
    <section className="container py-16">
      <CaptureForm
        heading="Stay in the loop"
        intro="New songs and shows from Travis Ehrenstrom & TEB — straight to your inbox."
        placement="footer_cta"
      />
    </section>
  )
}

export default SiteCaptureCTA
