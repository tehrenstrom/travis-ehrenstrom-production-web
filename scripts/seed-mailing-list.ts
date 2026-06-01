import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { seedMailingList } from '@/endpoints/seedMailingList'

/**
 * Seeds the "Join the Mailing List" feature (form + /mailing-list page + nav link).
 * Idempotent. Run with: pnpm seed:mailing-list
 *
 * The actual logic lives in src/endpoints/seedMailingList.ts so it can also run inside
 * the deployed app (where the production DATABASE_URL is available).
 */
const run = async () => {
  console.log('Mailing List Seed Script')
  console.log('========================\n')

  const payload = await getPayload({ config: configPromise })

  try {
    const result = await seedMailingList(payload)
    console.log(`✓ Form:  ${result.formId}`)
    console.log(`✓ Page:  /${'mailing-list'} (${result.pageId})`)
    console.log(`✓ Nav:   ${result.navUpdated ? 'added "Mailing List" link' : 'already linked'}`)
    console.log('\n✅ Mailing list is ready at /mailing-list')
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
