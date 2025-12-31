import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Page } from '@/payload-types'

async function updateHomeShows() {
  const payload = await getPayload({ config: configPromise })

  console.log('🔍 Finding home page...')

  const homePages = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
    },
    limit: 1,
  })

  if (!homePages.docs.length) {
    console.error('❌ Home page not found!')
    process.exit(1)
  }

  const homePage = homePages.docs[0] as Page
  console.log(`✅ Found home page (ID: ${homePage.id})`)

  // Get current layout
  const currentLayout = homePage.layout || []

  // Find and update ShowsPreview blocks
  let updated = false
  const newLayout = currentLayout.map((block) => {
    if (block.blockType === 'showsPreview') {
      if ((block as any).includePast === true) {
        console.log('📝 Setting includePast to false on ShowsPreview block')
        updated = true
        return {
          ...block,
          includePast: false,
        }
      }
    }
    return block
  })

  if (!updated) {
    console.log('ℹ️  No ShowsPreview blocks with includePast=true found.')
    process.exit(0)
  }

  // Update the page
  console.log('💾 Saving updated home page...')
  await payload.update({
    collection: 'pages',
    id: homePage.id,
    data: {
      layout: newLayout,
    },
    context: {
      disableRevalidate: true,
    },
  })

  console.log('✅ Home page updated - only upcoming shows will display!')

  process.exit(0)
}

updateHomeShows().catch((err) => {
  console.error('Error updating home page:', err)
  process.exit(1)
})

