import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { seedRedesign } from '@/endpoints/seedRedesign'

/**
 * Applies the 2026 design-system overhaul content (pages, forms, header nav,
 * redirects). Idempotent — safe to re-run; pages are versioned so prior
 * content stays recoverable in /admin.
 *
 * Run with:        pnpm seed:redesign
 * Targeted re-run: pnpm seed:redesign --only=home,booking
 *                  (forms/header/redirects are skipped when --only is used)
 */
const run = async () => {
  console.log('TEB Redesign Content Seed')
  console.log('=========================\n')

  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))
  const only = onlyArg
    ? onlyArg
        .replace('--only=', '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined

  if (only) console.log(`Limiting to pages: ${only.join(', ')}\n`)

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await seedRedesign(payload, { only })

    for (const [slug, id] of Object.entries(result.pages)) {
      console.log(`✓ Page:     ${slug} (${id})`)
    }
    for (const [title, id] of Object.entries(result.forms)) {
      console.log(`✓ Form:     ${title} (${id})`)
    }
    for (const redirect of result.redirects) {
      console.log(`✓ Redirect: ${redirect}`)
    }
    console.log(`✓ Header:   ${result.headerUpdated ? 'nav updated' : 'skipped (--only)'}`)
    console.log('\n✅ Redesign content applied. Run `pnpm export:content` and commit the diff.')
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
