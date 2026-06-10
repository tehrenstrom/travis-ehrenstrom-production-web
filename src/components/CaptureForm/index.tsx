'use client'

import React, { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utilities/ui'
import { getClientSideURL } from '@/utilities/getURL'

/**
 * Site-wide list-capture form. The list is the primary site-wide action, so this
 * component is intentionally self-contained: it POSTs straight to the existing
 * /mailing-list/subscribe route (which forwards to the Google Sheet) and does not
 * depend on a Payload form being fetched, so it stays fast and droppable anywhere.
 *
 * City/state and phone are the routing + SMS data — kept visible, never behind a
 * disclosure. On success it fires the `mailing_list_signup` GTM event tagged with
 * `placement` so we can track conversions per location (hero, footer, /mailing-list…).
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type CaptureFormProps = {
  /** Where this instance lives. Sent with the GTM conversion event. */
  placement?: string
  className?: string
  /** Optional heading + intro rendered above the fields. */
  heading?: string
  intro?: string
}

export const CaptureForm: React.FC<CaptureFormProps> = ({
  placement = 'unknown',
  className,
  heading,
  intro,
}) => {
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const fieldId = (name: string) => `capture-${placement}-${name}`

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      setError(undefined)

      if (!EMAIL_RE.test(email.trim())) {
        setError('Please enter a valid email address.')
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`${getClientSideURL()}/mailing-list/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            location: location.trim(),
            phone: phone.trim(),
          }),
        })

        const data = (await res.json().catch(() => null)) as {
          errors?: { message: string }[]
        } | null

        if (!res.ok) {
          setError(
            data?.errors?.[0]?.message ??
              "Sorry — we couldn't add you to the list just now. Please try again in a moment.",
          )
          return
        }

        // Primary conversion KPI — one event per placement.
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({ event: 'mailing_list_signup', placement })
        }

        setHasSubmitted(true)
      } catch {
        setError(
          "Sorry — we couldn't reach the server. Please check your connection and try again.",
        )
      } finally {
        setIsLoading(false)
      }
    },
    [email, location, phone, placement],
  )

  return (
    <div className={cn('w-full max-w-xl mx-auto', className)}>
      {(heading || intro) && !hasSubmitted && (
        <div className="mb-6 text-center">
          {heading && <h2 className="font-display text-display-sm">{heading}</h2>}
          {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
        </div>
      )}

      <div className="rounded-md border border-border bg-card p-4 lg:p-6">
        {hasSubmitted ? (
          <p className="text-center text-base" role="status">
            Thanks for joining! We&rsquo;ll be in touch about new releases and shows.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {error && (
              <div className="mb-4 text-sm text-destructive" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                className="mb-1.5 block text-sm font-medium"
                htmlFor={fieldId('email')}
              >
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                autoComplete="email"
                id={fieldId('email')}
                inputMode="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium"
                  htmlFor={fieldId('location')}
                >
                  City, State
                </label>
                <Input
                  autoComplete="address-level2"
                  id={fieldId('location')}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="So I know when I'm playing near you"
                  type="text"
                  value={location}
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium"
                  htmlFor={fieldId('phone')}
                >
                  Phone
                </label>
                <Input
                  autoComplete="tel"
                  id={fieldId('phone')}
                  inputMode="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="For show-day texts, if you want them"
                  type="tel"
                  value={phone}
                />
              </div>
            </div>

            <Button disabled={isLoading} type="submit" variant="default">
              {isLoading ? 'Joining…' : 'Join the list'}
            </Button>

            <p className="mt-3 text-sm text-muted-foreground">
              No spam, just songs and shows. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default CaptureForm
