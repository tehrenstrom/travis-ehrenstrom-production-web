import { getPayload } from 'payload'
import config from '@payload-config'

import { seedMailingList } from '@/endpoints/seedMailingList'

export const maxDuration = 60

/**
 * Guarded one-off endpoint to seed/update the mailing-list form/page/nav in an environment
 * where the DATABASE_URL is only available at runtime (e.g. production on Vercel).
 *
 * Auth: pass ?secret=<SEED_SECRET>. Returns 404 when SEED_SECRET is unset so the route
 * is inert unless explicitly enabled. Safe to remove once seeding is done.
 */
export async function GET(request: Request): Promise<Response> {
  const expected = process.env.SEED_SECRET
  if (!expected) {
    return new Response('Not found', { status: 404 })
  }

  const provided = new URL(request.url).searchParams.get('secret')
  if (provided !== expected) {
    return new Response('Forbidden', { status: 403 })
  }

  const payload = await getPayload({ config })
  try {
    const result = await seedMailingList(payload)
    return Response.json({ success: true, ...result })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error seeding mailing list.'
    payload.logger.error({ err: e, message: 'Error seeding mailing list' })
    return new Response(message, { status: 500 })
  }
}
