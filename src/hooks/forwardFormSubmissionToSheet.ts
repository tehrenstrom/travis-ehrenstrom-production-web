import type { CollectionAfterChangeHook } from 'payload'

import type { Form, FormSubmission } from '@/payload-types'

/**
 * Forwards "Join the Mailing List" form submissions to a Google Sheet via a
 * Google Apps Script web app (see scripts/google-apps-script/).
 *
 * Wired into the form-builder plugin's `form-submissions` collection in
 * src/plugins/index.ts. It self-filters to the mailing-list form by title, so
 * submissions for other forms (e.g. the Contact Form) are left untouched.
 *
 * Fault-tolerant by design: the submission is already persisted in Payload, so a
 * Sheets/network failure is logged but never thrown — a fan's signup must not fail
 * just because the spreadsheet is unreachable.
 */
export const forwardFormSubmissionToSheet: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) return doc

  const submission = doc as FormSubmission
  const targetTitle = process.env.MAILING_LIST_FORM_TITLE || 'Join the Mailing List'

  try {
    // Resolve the related form so we only forward mailing-list signups.
    const form: Form | null =
      typeof submission.form === 'object'
        ? submission.form
        : await req.payload.findByID({ collection: 'forms', id: submission.form, depth: 0 })

    if (!form || form.title !== targetTitle) return doc

    // Flatten submissionData ([{ field, value }]) into a keyed object.
    const values: Record<string, string> = {}
    for (const entry of submission.submissionData ?? []) {
      values[entry.field] = entry.value
    }

    // Bound the request: a slow/unreachable Apps Script endpoint must never hang
    // the form submission (on a serverless host a hung fetch can exhaust the
    // function's timeout and turn a saved signup into a 5xx for the fan).
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
        name: values.name ?? '',
        email: values.email ?? '',
        location: values.location ?? '',
        phone: values.phone ?? '',
        source: 'website',
        submittedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      req.payload.logger.error(
        `Google Sheets webhook returned ${response.status} for mailing-list signup`,
      )
    }
  } catch (err) {
    req.payload.logger.error({ err }, 'Failed to forward mailing-list signup to Google Sheet')
  }

  return doc
}
