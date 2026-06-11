import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Removes the phone number from all booking pages in the live database.
 *
 * - booking-teb / booking-solo: nulls out contactPhone on FastFacts blocks
 * - booking: removes the standalone email · phone paragraph from the content block
 *
 * Run with: pnpm tsx scripts/remove-contact-phone.ts
 */

const PHONE = '(541) 749-8416'

const stripPhoneFromRichText = (richText: any): { changed: boolean; value: any } => {
  if (!richText?.root?.children) return { changed: false, value: richText }

  const filtered = richText.root.children.filter((node: any) => {
    if (node.type !== 'paragraph') return true
    const text = (node.children ?? []).map((c: any) => c.text ?? '').join('')
    return !text.includes(PHONE)
  })

  if (filtered.length === richText.root.children.length) return { changed: false, value: richText }

  return {
    changed: true,
    value: { ...richText, root: { ...richText.root, children: filtered } },
  }
}

const run = async () => {
  console.log('Remove Contact Phone')
  console.log('====================\n')

  const payload = await getPayload({ config: configPromise })

  try {
    const SLUGS = ['booking-teb', 'booking-solo', 'booking']

    for (const slug of SLUGS) {
      const result = await payload.find({
        collection: 'pages',
        limit: 1,
        pagination: false,
        overrideAccess: true,
        where: { slug: { equals: slug } },
      })

      const page = result.docs?.[0]
      if (!page) {
        console.log(`  ⚠  /${slug} — not found, skipping`)
        continue
      }

      const layout: any[] = page.layout ?? []
      let changed = false

      const updatedLayout = layout.map((block: any) => {
        // FastFacts: null out contactPhone
        if (block.blockType === 'fastFacts' && block.contactPhone) {
          console.log(`  found contactPhone on fastFacts block in ${slug}`)
          changed = true
          return { ...block, contactPhone: null }
        }

        // Content blocks: strip paragraphs containing the phone number
        if (block.blockType === 'content' && Array.isArray(block.columns)) {
          const updatedColumns = block.columns.map((col: any) => {
            const { changed: colChanged, value } = stripPhoneFromRichText(col.richText)
            if (colChanged) {
              console.log(`  found phone in content block richText in ${slug}`)
              changed = true
              return { ...col, richText: value }
            }
            return col
          })
          return { ...block, columns: updatedColumns }
        }

        return block
      })

      if (!changed) {
        console.log(`  ✓ /${slug} — already clean`)
        continue
      }

      await payload.update({
        collection: 'pages',
        id: page.id,
        overrideAccess: true,
        data: { layout: updatedLayout },
      })

      console.log(`  ✅ /${slug} — updated`)
    }

    console.log('\nDone.')
  } finally {
    await payload.destroy()
  }
}

run().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
