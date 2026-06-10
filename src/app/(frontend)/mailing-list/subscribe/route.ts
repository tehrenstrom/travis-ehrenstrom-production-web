import { NextResponse } from 'next/server'

/**
 * Direct "Join the Mailing List" signup endpoint.
 *
 * Forwards the signup straight to the Google Apps Script web app (which appends a
 * row to the Google Sheet) — see scripts/google-apps-script/. Deliberately does NOT
 * touch Payload/MongoDB: the Sheet is the system of record for mailing-list signups,
 * so a database hiccup can never block a fan from joining the list.
 *
 * The mailing-list form (src/blocks/Form/Component.tsx) POSTs here instead of
 * /api/form-submissions. Other forms (e.g. Contact) still go through Payload.
 */

export const dynamic = 'force-dynamic'

const FETCH_TIMEOUT_MS = 5000

type SignupBody = {
  name?: unknown
  email?: unknown
  location?: unknown
  phone?: unknown
}

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ errors: [{ message }] }, { status })

export async function POST(request: Request): Promise<Response> {
  let body: SignupBody
  try {
    body = (await request.json()) as SignupBody
  } catch {
    return errorResponse('Invalid request.', 400)
  }

  const email = asString(body.email)
  const name = asString(body.name)
  const location = asString(body.location)
  const phone = asString(body.phone)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse('Please enter a valid email address.', 400)
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    // No destination configured — fail loudly rather than silently dropping a signup.
    console.error('Mailing-list signup failed: GOOGLE_SHEETS_WEBHOOK_URL is not set.')
    return errorResponse("Sorry — we couldn't add you to the list just now. Please try again later.", 500)
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
        name,
        email,
        location,
        phone,
        source: 'website',
        submittedAt: new Date().toISOString(),
      }),
    })

    // Apps Script always responds 200; the real outcome is in the JSON `ok` flag.
    let ok = response.ok
    try {
      const data = (await response.json()) as { ok?: boolean }
      if (typeof data?.ok === 'boolean') ok = data.ok
    } catch {
      // Non-JSON body — fall back to the HTTP status.
    }

    if (!ok) {
      console.error(`Mailing-list webhook rejected signup (status ${response.status}).`)
      return errorResponse(
        "Sorry — we couldn't add you to the list just now. Please try again in a moment.",
        502,
      )
    }
  } catch (err) {
    console.error('Mailing-list signup failed to reach the Google Sheets webhook:', err)
    return errorResponse(
      "Sorry — we couldn't add you to the list just now. Please try again in a moment.",
      502,
    )
  }

  return NextResponse.json({ success: true })
}
