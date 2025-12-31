import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Page } from '@/payload-types'

const textNode = (text: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const buildParagraph = (body: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'paragraph' as const,
        children: [textNode(body)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const buildRichText = (heading: string, body: string) => ({
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        children: [textNode(heading)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        tag: 'h3' as const,
        version: 1,
      },
      {
        type: 'paragraph' as const,
        children: [textNode(body)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

// QuickSummary block data
const quickSummaryBlock = {
  blockType: 'quickSummary' as const,
  eyebrow: 'At a Glance',
  title: 'Travis Ehrenstrom Band',
  who: 'Indie-folk multi-instrumentalist & 6-piece band from Central Oregon',
  what: 'Original songs blending folk storytelling with funk & jam-band grooves',
  where: 'Bend, Oregon & the Pacific Northwest',
  when: 'Active since 2017 (solo work since 2004)',
  why: 'Music that connects communities through honest songwriting',
}

// TeamGrid baseball cards block data
const teamGridBlock = {
  blockType: 'teamGrid' as const,
  heading: 'The Lineup',
  subheading: 'Meet the Band',
  layout: 'baseballCards' as const,
  members: [
    {
      name: 'Travis Ehrenstrom',
      role: 'Vocals / Guitar / Strings',
      hometown: 'Sisters, OR',
      yearsActive: '2004–Present',
      funFact: '50 states, 50 songs',
      number: '01',
    },
    {
      name: 'Patrick Pearsall',
      role: 'Bass / Vocals',
      hometown: 'Bend, OR',
      yearsActive: '2017–Present',
      funFact: 'The groove anchor',
      number: '02',
    },
    {
      name: 'Conner Bennett',
      role: 'Lead Guitar',
      hometown: 'Bend, OR',
      yearsActive: '2017–Present',
      funFact: 'Solo wizard',
      number: '03',
    },
    {
      name: 'Patrick Ondrozeck',
      role: 'Keys',
      hometown: 'Bend, OR',
      yearsActive: '2017–Present',
      funFact: 'Textural magic',
      number: '04',
    },
    {
      name: 'Kyle Pickard',
      role: 'Drums',
      hometown: 'Bend, OR',
      yearsActive: '2017–Present',
      funFact: 'Pocket master',
      number: '05',
    },
  ],
}

async function updateAboutPage() {
  const payload = await getPayload({ config: configPromise })

  console.log('🔍 Finding about page...')

  // Find the about page
  const aboutPages = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'about' },
    },
    limit: 1,
  })

  if (!aboutPages.docs.length) {
    console.error('❌ About page not found!')
    process.exit(1)
  }

  const aboutPage = aboutPages.docs[0] as Page
  console.log(`✅ Found about page (ID: ${aboutPage.id})`)

  // Get current layout
  const currentLayout = aboutPage.layout || []

  // Check if quickSummary already exists
  const hasQuickSummary = currentLayout.some((block) => block.blockType === 'quickSummary')
  // Check if teamGrid with baseball cards already exists
  const hasBaseballCards = currentLayout.some(
    (block) => block.blockType === 'teamGrid' && (block as any).layout === 'baseballCards'
  )

  if (hasQuickSummary && hasBaseballCards) {
    console.log('ℹ️  Both blocks already exist on the about page.')
    process.exit(0)
  }

  // Build new layout
  let newLayout = [...currentLayout]

  // Add QuickSummary at the beginning if it doesn't exist
  if (!hasQuickSummary) {
    console.log('➕ Adding QuickSummary block...')
    newLayout = [quickSummaryBlock as any, ...newLayout]
  }

  // Find and replace the old Band Members content block with TeamGrid
  // Or add TeamGrid after documentaryTimeline if no old block found
  if (!hasBaseballCards) {
    console.log('➕ Adding TeamGrid baseball cards block...')

    // Look for an existing "Band Members" content block to replace
    const bandMembersIndex = newLayout.findIndex(
      (block) =>
        block.blockType === 'content' &&
        (block as any).columns?.some((col: any) =>
          JSON.stringify(col.richText).toLowerCase().includes('band members')
        )
    )

    if (bandMembersIndex !== -1) {
      // Replace the old Band Members block
      console.log('   Replacing old "Band Members" content block...')
      newLayout[bandMembersIndex] = teamGridBlock as any
    } else {
      // Find documentaryTimeline and insert after it
      const timelineIndex = newLayout.findIndex((block) => block.blockType === 'documentaryTimeline')
      if (timelineIndex !== -1) {
        console.log('   Inserting after documentaryTimeline...')
        newLayout.splice(timelineIndex + 1, 0, teamGridBlock as any)
      } else {
        // Just append to the end
        console.log('   Appending to end of layout...')
        newLayout.push(teamGridBlock as any)
      }
    }
  }

  // Update the page
  console.log('💾 Saving updated about page...')
  await payload.update({
    collection: 'pages',
    id: aboutPage.id,
    data: {
      layout: newLayout,
    },
    context: {
      disableRevalidate: true,
    },
  })

  console.log('✅ About page updated successfully!')
  console.log('')
  console.log('New blocks added:')
  if (!hasQuickSummary) console.log('  • QuickSummary (At a Glance)')
  if (!hasBaseballCards) console.log('  • TeamGrid (Baseball Cards - 5 band members)')

  process.exit(0)
}

updateAboutPage().catch((err) => {
  console.error('Error updating about page:', err)
  process.exit(1)
})

