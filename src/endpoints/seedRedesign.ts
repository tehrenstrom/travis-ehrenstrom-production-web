import type { Payload } from 'payload'

import type { Form, Page } from '@/payload-types'

import { headingNode, paragraph, paragraphNode, richText, textNode } from './lexicalHelpers'

/**
 * Applies the 2026 design-system overhaul content (Website_Copy_-_tebmusic_com
 * v1, Jun 9 2026) to Payload: pages, forms, header nav, and redirects.
 *
 * Idempotent — pages/forms are upserted by slug/title, redirects by `from`.
 * Pages are versioned (drafts enabled), so every update leaves the previous
 * content recoverable in /admin → page → Versions.
 *
 * Intentionally NOT seeded (per launch decisions):
 * - All "There Is Only Now" album content (home album block, /there-is-only-now)
 *   — added at the October announce.
 * - Bracketed TBDs from the copy doc (draw numbers, rider summaries, one-sheet/
 *   stage-plot downloads) — Travis adds these in /admin when he has them.
 * - about/shows/music/posts pages — restyle only, content untouched.
 *
 * /mailing-list keeps its URL (active printed QR campaigns point there); the
 * copy doc's "/list" copy is applied TO it and /list redirects into it.
 */

export const CONTACT_EMAIL = 'travisehrenstrom@gmail.com'
export const CONTACT_PHONE = '(541) 749-8416'
export const MAILING_LIST_FORM_TITLE = 'Join the Mailing List' // must not change: Form block keys its Sheet-POST bypass on it
export const HOUSE_CONCERT_FORM_TITLE = 'House Concert Inquiry'
export const CONTACT_FORM_TITLE = 'Contact Form'

const CAPTURE_INTRO =
  "Every show and every song lands here first. If you want to know when we're playing near you, this is the spot. I'd love to have you."

type SeedOptions = {
  /** Limit the run to these page slugs (forms/header/redirects always run). */
  only?: string[]
}

export type SeedRedesignResult = {
  pages: Record<string, string>
  forms: Record<string, string>
  redirects: string[]
  headerUpdated: boolean
}

export const seedRedesign = async (
  payload: Payload,
  { only }: SeedOptions = {},
): Promise<SeedRedesignResult> => {
  const result: SeedRedesignResult = { pages: {}, forms: {}, redirects: [], headerUpdated: false }

  // --- 1. Forms -------------------------------------------------------------

  const upsertForm = async (title: string, data: Omit<Partial<Form>, 'id'>): Promise<Form> => {
    const existing = await payload.find({
      collection: 'forms',
      where: { title: { equals: title } },
      limit: 1,
      overrideAccess: true,
    })
    const form = existing.docs[0]
      ? await payload.update({
          collection: 'forms',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'forms',
          data: { title, ...data } as Form,
          overrideAccess: true,
        })
    result.forms[title] = String(form.id)
    return form
  }

  // Mailing-list form: drop the name field per the copy doc (email/city/phone only)
  await upsertForm(MAILING_LIST_FORM_TITLE, {
    title: MAILING_LIST_FORM_TITLE,
    fields: [
      { blockType: 'email', name: 'email', label: 'Email', width: 100, required: true },
      // Text (not number) so phone formatting and leading zeros survive.
      {
        blockType: 'text',
        name: 'location',
        label: 'City, State',
        width: 100,
        required: false,
      },
      { blockType: 'text', name: 'phone', label: 'Phone', width: 100, required: false },
    ],
    submitButtonLabel: 'Join the list',
    confirmationType: 'message',
    confirmationMessage: richText([
      paragraph("Thanks for joining! We'll be in touch about new releases and shows."),
    ]),
  })

  const houseConcertForm = await upsertForm(HOUSE_CONCERT_FORM_TITLE, {
    title: HOUSE_CONCERT_FORM_TITLE,
    fields: [
      { blockType: 'text', name: 'name', label: 'Name', width: 100, required: true },
      { blockType: 'email', name: 'email', label: 'Email', width: 100, required: true },
      {
        blockType: 'text',
        name: 'location',
        label: 'Where are you? (City, State)',
        width: 100,
        required: false,
      },
      {
        blockType: 'textarea',
        name: 'message',
        label: 'What are you imagining?',
        width: 100,
        required: false,
      },
    ],
    submitButtonLabel: 'I want to host',
    confirmationType: 'message',
    confirmationMessage: richText([
      paragraph(
        "Thanks — I read every note. I'll be in touch soon and we'll figure out an evening together.",
      ),
    ]),
    emails: [
      {
        emailTo: CONTACT_EMAIL,
        subject: 'New house concert inquiry from {{name}}',
        message: richText([
          paragraph('Name: {{name}}'),
          paragraph('Email: {{email}}'),
          paragraph('Location: {{location}}'),
          paragraph('Note: {{message}}'),
        ]),
      },
    ],
  })

  const contactFormDocs = await payload.find({
    collection: 'forms',
    where: { title: { equals: CONTACT_FORM_TITLE } },
    limit: 1,
    overrideAccess: true,
  })
  const contactForm = contactFormDocs.docs[0] ?? null

  // --- 2. Pages ---------------------------------------------------------------

  const upsertPage = async (slug: string, data: Partial<Page>): Promise<void> => {
    if (only && !only.includes(slug)) return

    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    })

    const pageData = { ...data, slug, _status: 'published' as const }

    const page = existing.docs[0]
      ? await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: pageData,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'pages',
          data: pageData as Page,
          overrideAccess: true,
        })

    result.pages[slug] = String(page.id)
  }

  // Reuse the existing home hero photo (hero media is required for highImpact)
  const existingHome = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  })
  const homeHeroMedia = existingHome.docs[0]?.hero?.media ?? null

  // ---- home -----------------------------------------------------------------
  await upsertPage('home', {
    title: 'Home',
    hero: {
      type: 'highImpact',
      kicker: 'Central Oregon · Pacific Northwest Americana',
      richText: richText([
        headingNode('Songs about people and place, played with friends.', 'h1'),
        paragraph(
          "Travis Ehrenstrom writes them. Some nights it's just him and a guitar. Some nights it's TEB, the five-piece. Either way, you're invited.",
        ),
      ]),
      links: [
        {
          link: {
            type: 'custom',
            url: '/mailing-list',
            label: 'Join the list',
            appearance: 'default',
          },
        },
        { link: { type: 'custom', url: '/shows', label: 'Upcoming shows', appearance: 'outline' } },
      ],
      note: 'The list hears about every show first. No spam, just songs and shows.',
      media: homeHeroMedia,
    },
    layout: [
      {
        blockType: 'showsPreview',
        heading: 'Upcoming shows',
        introContent: richText([
          paragraph('Catch Travis and TEB live. Details and tickets updated as new dates land.'),
        ]),
        project: 'all',
        limit: 4,
        includePast: false,
        ctaLink: { type: 'custom', url: '/shows', label: 'View all shows' },
      },
      {
        blockType: 'choiceCards',
        kicker: 'One songwriter, two ways to hear it',
        heading: 'Pick your room',
        cards: [
          {
            title: 'Travis — solo',
            tag: 'Solo',
            body: 'Folk songs up close. Listening rooms, theatres, living rooms — quiet enough to hear the words.',
            link: { type: 'custom', url: '/booking/solo', label: 'Solo press kit & booking' },
          },
          {
            title: 'TEB — the band',
            tag: 'TEB',
            body: 'The five-piece. A decade of friends chasing the jam wherever it goes — built for festivals and dance floors.',
            link: { type: 'custom', url: '/booking/teb', label: 'TEB press kit & booking' },
          },
        ],
      },
      {
        blockType: 'captureForm',
        heading: 'Stay in the loop',
        intro: CAPTURE_INTRO,
        placement: 'home',
        background: 'sunset',
      },
    ],
    meta: {
      title: 'Travis Ehrenstrom & TEB — Pacific Northwest Americana',
      description:
        'Travis Ehrenstrom & TEB — Pacific Northwest Americana from Central Oregon. Solo folk and five-piece jam-rock. Shows, music, and the mailing list.',
    },
  })

  // ---- /mailing-list (QR landing — URL preserved for printed codes) ----------
  await upsertPage('mailing-list', {
    title: 'Stay in the loop',
    hero: {
      type: 'lowImpact',
      richText: richText([headingNode('Stay in the loop', 'h1')]),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                "Thanks for coming out tonight. If you want to know when we're playing next, leave your info — every show gets announced here first, and that's all this is.",
              ),
            ]),
          },
        ],
      },
      {
        blockType: 'captureForm',
        heading: 'Stay in the loop',
        intro: CAPTURE_INTRO,
        placement: 'list_page',
        background: 'plain',
      },
    ],
    meta: {
      title: 'Stay in the loop — Travis Ehrenstrom & TEB',
      description:
        'Join the Travis Ehrenstrom & TEB mailing list — every show and every song, announced here first.',
    },
  })

  // ---- /booking (chooser) ----------------------------------------------------
  await upsertPage('booking', {
    title: 'Booking & Press',
    hero: {
      type: 'lowImpact',
      richText: richText([
        headingNode('Booking & Press', 'h1'),
        paragraph(
          "Two acts, one songwriter. Pick the kit you need — or just write to us and we'll point you the right way.",
        ),
      ]),
    },
    layout: [
      {
        blockType: 'choiceCards',
        cards: [
          {
            title: 'Travis Ehrenstrom — solo',
            tag: 'Solo',
            body: 'Intimate folk for listening rooms, theatres, festivals, and house concerts.',
            link: { type: 'custom', url: '/booking/solo', label: 'Solo press kit' },
          },
          {
            title: 'TEB',
            tag: 'TEB',
            body: 'Five-piece jam-rock Americana for festivals, breweries, and big rooms.',
            link: { type: 'custom', url: '/booking/teb', label: 'TEB press kit' },
          },
        ],
      },
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                `Looking for music to license? Every song is one-stop — master and publishing cleared with one signature. Write to ${CONTACT_EMAIL}.`,
              ),
              paragraph(`${CONTACT_EMAIL} · ${CONTACT_PHONE}`),
            ]),
          },
        ],
      },
    ],
    meta: {
      title: 'Booking & Press — Travis Ehrenstrom & TEB',
      description:
        'Booking and press for Travis Ehrenstrom (solo folk) and TEB (five-piece jam-rock Americana) from Bend, Oregon. Press kits, photos, and contact.',
    },
  })

  // ---- /booking/solo (page slug booking-solo) --------------------------------
  // Bio per the copy doc; the "There Is Only Now" paragraph is held back until
  // the album announce.
  await upsertPage('booking-solo', {
    title: 'Solo Press Kit',
    hero: {
      type: 'lowImpact',
      kicker: 'Booking & press',
      richText: richText([headingNode('Travis Ehrenstrom — solo', 'h1')]),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                'Travis Ehrenstrom is a singer-songwriter from Sisters, Oregon, who has spent two decades writing songs about connection, nature, and the shared human experience. He learned the craft early — from folk festivals and from artists like Kelly Joe Phelps, Meg Hutchinson, and Willy Porter — and grew up on the songwriters who still shape his work: John Prine, Jackson Browne, Joni Mitchell, Bob Dylan.',
              ),
              paragraph(
                'As a solo performer he works close to the audience: warm tenor voice, plain-spoken lyrics, rooms quiet enough to hear them. He has played everywhere from house concerts to Sisters Folk Festival, 4 Peaks, and Cascade Equinox, and has shared stages with The Head and The Heart, Jackson Browne, David Ramirez, The Mother Hips, Goose, Leftover Salmon, and The Brothers Comatose. His songwriting earned an Honorable Mention in the Telluride Troubadour competition.',
              ),
            ]),
          },
        ],
      },
      {
        blockType: 'fastFacts',
        heading: 'Fast facts',
        facts: [
          { label: 'Format', value: 'Solo acoustic (guitar + vocals); duo available on request' },
          { label: 'Genre', value: 'Folk / Americana singer-songwriter' },
          { label: 'Home market', value: 'Bend / Central Oregon' },
          {
            label: 'Best rooms',
            value: 'Listening rooms, theatres, house concerts, festival side stages',
          },
        ],
        downloads: [],
        contactEmail: CONTACT_EMAIL,
        contactPhone: CONTACT_PHONE,
      },
    ],
    meta: {
      title: 'Book Travis Ehrenstrom — Solo',
      description:
        'Book Travis Ehrenstrom — folk singer-songwriter from Central Oregon. Listening rooms, theatres, house concerts. EPK, photos, video, one-sheet.',
    },
  })

  // ---- /booking/teb (page slug booking-teb) -----------------------------------
  await upsertPage('booking-teb', {
    title: 'TEB Press Kit',
    hero: {
      type: 'lowImpact',
      kicker: 'Booking & press',
      richText: richText([headingNode('TEB', 'h1')]),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                'TEB is what happens when five longtime friends from Bend, Oregon stop rehearsing and start listening to each other. Travis Ehrenstrom writes the songs — folk storytelling at the core — and the band takes them somewhere new every night: funk, jam-rock, and the kind of improvised detours that only come from a decade of playing together.',
              ),
              paragraph(
                'The lineup: Travis Ehrenstrom (vocals, guitar), Patrick Pearsall (bass, vocals), Conner Bennett (lead guitar), Patrick Ondrozeck (keys), and Kyle Pickard (drums).',
              ),
              paragraph(
                "What started as brewery stands around Central Oregon has grown into festival slots at Sisters Folk Festival, 4 Peaks, Cascade Equinox, Bend's Fall Festival, and Cruxapalooza, plus albums including Something on the Surface (2018), Hollinshead (2023), and Lady Luck (2024) — the last one recorded live in a living room to bottle what the band does on stage.",
              ),
            ]),
          },
        ],
      },
      {
        blockType: 'pressQuotes',
        heading: '',
        quotes: [
          {
            quote:
              "Every time I play with those guys, there's a moment where it's just like — whoa, I can't believe we just did that.",
            attribution: 'Travis Ehrenstrom',
            source: "That's the show.",
          },
        ],
        recentPress: [],
      },
      {
        blockType: 'fastFacts',
        heading: 'Fast facts',
        facts: [
          { label: 'Format', value: 'Five-piece (guitar/vocals, lead guitar, bass, keys, drums)' },
          { label: 'Genre', value: 'Jam-rock Americana / funk-folk' },
          { label: 'Home market', value: 'Bend / Central Oregon' },
          { label: 'Best rooms', value: 'Festivals, breweries, clubs, theatres, after-parties' },
        ],
        downloads: [],
        contactEmail: CONTACT_EMAIL,
        contactPhone: CONTACT_PHONE,
      },
    ],
    meta: {
      title: 'Book TEB — Travis Ehrenstrom Band',
      description:
        'Book TEB — five-piece jam-rock Americana from Bend, Oregon. Festivals, breweries, big rooms. EPK, photos, video, stage plot.',
    },
  })

  // ---- /house-concerts --------------------------------------------------------
  await upsertPage('house-concerts', {
    title: 'Host a house concert',
    hero: {
      type: 'lowImpact',
      richText: richText([headingNode('Host a house concert', 'h1')]),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                'Some of my favorite shows ever have been in living rooms and backyards. Twenty or thirty people, no stage, no PA half the time — just songs and the people you invited.',
              ),
              paragraph(
                "Here's how it works: you bring the people and the space, I bring the music. You invite your friends and neighbors, and we make an evening of it — we'll figure out what works when we talk.",
              ),
              paragraph(
                "I handle the rest. If you've got a room, a porch, or a backyard in Oregon or anywhere in the Northwest, I'd love to come play it.",
              ),
            ]),
          },
        ],
      },
      {
        blockType: 'formBlock',
        form: houseConcertForm.id,
        enableIntro: true,
        introContent: richText([
          paragraph("Tell me roughly where you are and what you're imagining — I read every note."),
        ]),
      },
    ],
    meta: {
      title: 'Host a house concert — Travis Ehrenstrom',
      description:
        'Host a Travis Ehrenstrom house concert in Oregon or the Pacific Northwest. You bring the people, he brings the songs.',
    },
  })

  // ---- /store (stub until stocked) ---------------------------------------------
  await upsertPage('store', {
    title: 'Store',
    hero: {
      type: 'lowImpact',
      richText: richText([headingNode('Store', 'h1')]),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                "New things are coming. In the meantime, everything we've recorded lives on Bandcamp.",
              ),
              paragraph(`Questions about orders? ${CONTACT_EMAIL}`),
            ]),
          },
        ],
      },
      {
        blockType: 'cta',
        richText: richText([paragraph('Every album, every EP — name your price.')]),
        links: [
          {
            link: {
              type: 'custom',
              url: 'https://travisehrenstrom.bandcamp.com',
              label: 'Visit Bandcamp',
              appearance: 'default',
              newTab: true,
            },
          },
        ],
      },
    ],
    meta: {
      title: 'Store — Travis Ehrenstrom & TEB',
      description:
        'Travis Ehrenstrom & TEB store. New things are coming — in the meantime, every record lives on Bandcamp.',
    },
  })

  // ---- /contact -----------------------------------------------------------------
  await upsertPage('contact', {
    title: 'Say hello',
    hero: {
      type: 'lowImpact',
      richText: richText([headingNode('Say hello', 'h1')]),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'twoThirds',
            richText: richText([
              paragraph(
                `For booking, house shows, or press, use the form or write to ${CONTACT_EMAIL}. We read every note.`,
              ),
            ]),
          },
        ],
      },
      ...(contactForm
        ? [
            {
              blockType: 'formBlock' as const,
              form: contactForm.id,
              enableIntro: false,
            },
          ]
        : []),
    ],
    meta: {
      title: 'Say hello — Travis Ehrenstrom & TEB',
      description:
        'Say hello to Travis Ehrenstrom & TEB — booking, house shows, press, or just to talk songs. We read every note.',
    },
  })

  // --- 3. Header nav -------------------------------------------------------------

  if (!only) {
    await payload.updateGlobal({
      slug: 'header',
      overrideAccess: true,
      data: {
        navItems: [
          { link: { type: 'custom', url: '/shows', label: 'Shows' } },
          { link: { type: 'custom', url: '/music', label: 'Music' } },
          { link: { type: 'custom', url: '/about', label: 'About' } },
          { link: { type: 'custom', url: '/posts', label: 'News' } },
          { link: { type: 'custom', url: '/booking', label: 'Booking' } },
          { link: { type: 'custom', url: '/house-concerts', label: 'House Concerts' } },
        ],
      },
    })
    result.headerUpdated = true
  }

  // --- 4. Redirects ----------------------------------------------------------------

  const redirects: { from: string; to: string }[] = [
    // Copy-doc URL alias; printed QR codes hit /mailing-list directly (no redirect).
    { from: '/list', to: '/mailing-list' },
    // Flat page slugs leak from generic slug->url code paths; send them to the
    // canonical nested URLs.
    { from: '/booking-solo', to: '/booking/solo' },
    { from: '/booking-teb', to: '/booking/teb' },
  ]

  for (const redirect of redirects) {
    const existing = await payload.find({
      collection: 'redirects',
      where: { from: { equals: redirect.from } },
      limit: 1,
      overrideAccess: true,
    })

    const data = {
      from: redirect.from,
      to: { type: 'custom' as const, url: redirect.to },
    }

    if (existing.docs[0]) {
      await payload.update({
        collection: 'redirects',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'redirects', data, overrideAccess: true })
    }
    result.redirects.push(`${redirect.from} -> ${redirect.to}`)
  }

  return result
}
