import 'dotenv/config'

import configPromise from '@payload-config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

/**
 * Dev helper: ensures at least one media doc exists (fresh local databases
 * have none, and the home hero requires an image). Uses the OG image from
 * /public. Idempotent.
 */
const run = async () => {
  const payload = await getPayload({ config: configPromise })

  try {
    const existing = await payload.find({ collection: 'media', limit: 1, overrideAccess: true })
    if (existing.docs[0]) {
      console.log(`media already present (${existing.docs[0].id})`)
      return
    }

    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'Travis Ehrenstrom Band' },
      filePath: path.resolve(dirname, '../public/teb-og.webp'),
      overrideAccess: true,
    })
    console.log(`created media ${doc.id}`)
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('bootstrap failed:', error)
  process.exit(1)
})
