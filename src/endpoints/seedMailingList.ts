import type { Payload } from 'payload'

import type { Form, Page } from '@/payload-types'

/**
 * Creates/updates the "Join the Mailing List" feature data: the form, a published
 * /mailing-list page that renders it, and a Header nav link. Idempotent.
 *
 * Shared by the CLI script (scripts/seed-mailing-list.ts) and the guarded seed route,
 * so it can be run either locally (with a DATABASE_URL) or inside the deployed app.
 */

export const FORM_TITLE = 'Join the Mailing List'
export const PAGE_SLUG = 'mailing-list'
export const NAV_LABEL = 'Mailing List'

// --- Minimal Lexical rich-text helpers (same shape as scripts/seed-booking-page.ts) ---
const textNode = (text: string, format = 0) => ({
  type: 'text' as const,
  detail: 0,
  format,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const paragraphNode = (children: ReturnType<typeof textNode>[]) => ({
  type: 'paragraph' as const,
  children,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const headingNode = (text: string, tag: 'h1' | 'h2' | 'h3' = 'h2') => ({
  type: 'heading' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

const richText = (
  children: Array<ReturnType<typeof paragraphNode> | ReturnType<typeof headingNode>>,
) => ({
  root: {
    type: 'root' as const,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export type SeedMailingListResult = {
  formId: string
  pageId: string
  navUpdated: boolean
}

export const seedMailingList = async (payload: Payload): Promise<SeedMailingListResult> => {
  // 1. Upsert the form ------------------------------------------------------
  const fields: NonNullable<Form['fields']> = [
    { blockType: 'text', name: 'name', label: 'Name', width: 100, required: false },
    { blockType: 'email', name: 'email', label: 'Email', width: 100, required: true },
    // Text (not number) so phone formatting and leading zeros survive.
    { blockType: 'text', name: 'location', label: 'Location (City, State)', width: 100, required: false },
    { blockType: 'text', name: 'phone', label: 'Phone number', width: 100, required: false },
  ]

  const formData = {
    title: FORM_TITLE,
    fields,
    submitButtonLabel: 'Join the list',
    confirmationType: 'message' as const,
    confirmationMessage: richText([
      paragraphNode([
        textNode("Thanks for joining! We'll be in touch about new releases and shows."),
      ]),
    ]),
  }

  const existingForms = await payload.find({
    collection: 'forms',
    where: { title: { equals: FORM_TITLE } },
    limit: 1,
    overrideAccess: true,
  })

  const form: Form = existingForms.docs[0]
    ? await payload.update({
        collection: 'forms',
        id: existingForms.docs[0].id,
        data: formData,
        overrideAccess: true,
      })
    : await payload.create({ collection: 'forms', data: formData, overrideAccess: true })

  // 2. Upsert the page ------------------------------------------------------
  const hero: Page['hero'] = {
    type: 'lowImpact',
    richText: richText([headingNode('Join the Mailing List', 'h1')]),
  }

  const layout: Page['layout'] = [
    {
      blockType: 'formBlock',
      form: form.id,
      enableIntro: true,
      introContent: richText([
        paragraphNode([
          textNode(
            'Get the first word on new music and upcoming shows. Drop your info below and we’ll keep you posted.',
          ),
        ]),
      ]),
    },
  ]

  const pageData = {
    title: FORM_TITLE,
    slug: PAGE_SLUG,
    _status: 'published' as const,
    hero,
    layout,
    meta: {
      title: 'Join the Mailing List - Travis Ehrenstrom Band',
      description:
        'Sign up to hear about new releases and upcoming shows from Travis Ehrenstrom and TEB.',
    },
  }

  const existingPage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: PAGE_SLUG } },
    limit: 1,
    overrideAccess: true,
  })

  const page: Page = existingPage.docs[0]
    ? await payload.update({
        collection: 'pages',
        id: existingPage.docs[0].id,
        data: pageData,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    : await payload.create({
        collection: 'pages',
        data: pageData,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })

  // 3. Add the Header nav link (dedupe) ------------------------------------
  const header = await payload.findGlobal({ slug: 'header', overrideAccess: true })
  const navItems = header.navItems ?? []

  const alreadyLinked = navItems.some((item) => {
    if (item.link?.label === NAV_LABEL) return true
    const ref = item.link?.reference
    if (ref && typeof ref === 'object' && ref.relationTo === 'pages') {
      const refId = typeof ref.value === 'object' ? ref.value.id : ref.value
      return refId === page.id
    }
    return false
  })

  if (!alreadyLinked) {
    await payload.updateGlobal({
      slug: 'header',
      overrideAccess: true,
      data: {
        navItems: [
          ...navItems,
          {
            link: {
              type: 'reference',
              reference: { relationTo: 'pages', value: page.id },
              label: NAV_LABEL,
            },
          },
        ],
      },
    })
  }

  return { formId: form.id, pageId: page.id, navUpdated: !alreadyLinked }
}
