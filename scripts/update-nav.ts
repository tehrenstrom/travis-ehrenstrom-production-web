import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Phase 1 nav cleanup for the header global. Idempotent.
 *
 *  - Removes the "Store" item (the /store route stays live, but is hidden from nav
 *    until CDs/merch are stocked ~Oct 2026 — re-add in Phase 4).
 *  - Removes the "Mailing List" item: the list is now reachable via the always-visible
 *    "Join the list" button in the header (src/Header/Component.client.tsx), so the
 *    plain nav link is redundant. The /mailing-list page + URL are untouched (active
 *    QR campaigns point there).
 *
 * Run with: pnpm tsx scripts/update-nav.ts
 */

// Match on label (case-insensitive) — header nav items are keyed by label.
const LABELS_TO_REMOVE = new Set(['store', 'mailing list'])

const run = async () => {
  console.log('Header Nav Update')
  console.log('=================\n')

  const payload = await getPayload({ config: configPromise })

  try {
    const header = await payload.findGlobal({ slug: 'header', overrideAccess: true })
    const navItems = header.navItems ?? []

    console.log(
      'Current nav:',
      navItems.map((i) => i.link?.label).filter(Boolean).join(', ') || '(empty)',
    )

    const kept = navItems.filter((item) => {
      const label = (item.link?.label ?? '').trim().toLowerCase()
      return !LABELS_TO_REMOVE.has(label)
    })

    if (kept.length === navItems.length) {
      console.log('\nNothing to remove — nav already clean.')
      return
    }

    await payload.updateGlobal({
      slug: 'header',
      overrideAccess: true,
      data: { navItems: kept },
    })

    console.log(
      '\nUpdated nav:',
      kept.map((i) => i.link?.label).filter(Boolean).join(', ') || '(empty)',
    )
    console.log(`\n✅ Removed ${navItems.length - kept.length} item(s).`)
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Nav update failed:', error)
  process.exit(1)
})
