/**
 * Restore the real show calendar (recovered from the live site cache on 2026-06-09,
 * see tmp/restore-snapshot/). Idempotent: clears the shows collection, then recreates.
 * Run: node --env-file=.env <tsx> scripts/restore-shows.ts
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

type Show = {
  date: string // YYYY-MM-DD
  project: 'teb' | 'travis'
  venue: string
  city: string
}

// region is Oregon for all; times unknown -> noon-ish UTC so the calendar day is
// stable in both UTC and Pacific display.
const SHOWS: Show[] = [
  // upcoming
  { date: '2026-07-03', project: 'teb', venue: 'Worthy Brewing Company', city: 'Bend' },
  { date: '2026-08-08', project: 'teb', venue: 'Tedeschi Trucks Band After Party @ Commonwealth', city: 'Bend' },
  { date: '2026-08-23', project: 'travis', venue: '10 Barrel Brewing West Side Bend', city: 'Bend' },
  // past
  { date: '2026-06-05', project: 'travis', venue: 'Bend Brewing Company', city: 'Bend' },
  { date: '2026-06-03', project: 'travis', venue: 'Travis Ehrenstrom & Conner Bennett', city: 'Bend' },
  { date: '2026-05-28', project: 'teb', venue: 'Silver Moon Brewing', city: 'Bend' },
  { date: '2026-05-27', project: 'travis', venue: 'Travis Ehrenstrom & Evan Mullins', city: 'Tumalo' },
  { date: '2026-05-25', project: 'travis', venue: 'Travis Ehrenstrom & Brent Alan', city: 'Bend' },
  { date: '2026-04-23', project: 'travis', venue: 'The Suttle Lodge & Boathouse', city: 'Sisters' },
  { date: '2026-04-11', project: 'teb', venue: 'On Tap', city: 'Bend' },
  { date: '2026-04-10', project: 'teb', venue: 'Silver Moon Brewing', city: 'Bend' },
  { date: '2026-02-14', project: 'travis', venue: 'Travis Ehrenstrom & Evan Mullins', city: 'Bend' },
  { date: '2026-02-07', project: 'teb', venue: 'Grateful Dead Night', city: 'Redmond' },
]

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'shows', limit: 500, depth: 0 })
for (const doc of existing.docs) {
  await payload.delete({ collection: 'shows', id: doc.id, context: { disableRevalidate: true } })
}
console.log(`Cleared ${existing.totalDocs} existing shows.`)

let created = 0
for (const s of SHOWS) {
  const title = `${s.venue} — ${s.city}, OR`
  await payload.create({
    collection: 'shows',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      _status: 'published',
      title,
      slug: `${slugify(s.venue)}-${s.date}`,
      project: s.project,
      date: `${s.date}T17:00:00.000Z`,
      venue: s.venue,
      location: { city: s.city, region: 'OR', country: 'USA' },
    } as any,
  })
  created++
}
console.log(`✅ Created ${created} shows.`)
await payload.destroy?.()
process.exit(0)
