import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Form, Media, Release } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  aboutImage: Media
  featuredRelease: Release
  newsletterForm: Form
}

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const buildRichText = (heading?: string, body?: string) => ({
  root: {
    type: 'root',
    children: [
      ...(heading
        ? [
            {
              type: 'heading',
              children: [textNode(heading)],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
          ]
        : []),
      ...(body
        ? [
            {
              type: 'paragraph',
              children: [textNode(body)],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ]
        : []),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  aboutImage,
  featuredRelease,
  newsletterForm,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    title: 'Home',
    hero: {
      type: 'highImpact',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Listen',
            url: '/music',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'Shows',
            url: '/shows',
          },
        },
      ],
      media: heroImage.id,
      richText: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [textNode('Travis Ehrenstrom')],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h1',
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                textNode('Singer-songwriter and frontman of TEB. New music, live shows, and more.'),
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    layout: [
      {
        blockType: 'announcement',
        eyebrow: 'Latest',
        heading: 'New EP out now',
        content: buildRichText(undefined, 'Stream the latest release and catch the next run of shows.'),
        link: {
          type: 'custom',
          label: 'Listen now',
          url: '/music',
          appearance: 'default',
        },
      },
      {
        blockType: 'featuredRelease',
        release: featuredRelease.id,
        ctaLink: {
          type: 'custom',
          label: 'Explore all releases',
          url: '/music',
          appearance: 'outline',
        },
      },
      {
        blockType: 'showsPreview',
        heading: 'Upcoming shows',
        introContent: buildRichText(
          undefined,
          'Catch Travis and TEB live. Tickets and details are updated as new dates drop.',
        ),
        includePast: false,
        limit: 3,
        project: 'all',
        ctaLink: {
          type: 'custom',
          label: 'View all shows',
          url: '/shows',
          appearance: 'outline',
        },
      },
      {
        blockType: 'archive',
        introContent: buildRichText('News', 'Updates, behind-the-scenes, and release notes.'),
        populateBy: 'collection',
        relationTo: 'posts',
        limit: 3,
      },
      {
        blockType: 'splitContent',
        heading: 'About Travis & TEB',
        content: buildRichText(
          undefined,
          'Travis Ehrenstrom is a Bend, OR-based songwriter blending folk and rock. TEB brings the full-band energy with a fusion-driven live show.',
        ),
        media: aboutImage.id,
        layout: 'mediaRight',
        ctaLink: {
          type: 'custom',
          label: 'Read the bio',
          url: '/about',
          appearance: 'default',
        },
      },
      {
        blockType: 'formBlock',
        enableIntro: true,
        form: newsletterForm,
        introContent: buildRichText('Stay in the loop', 'Join the mailing list for shows and music.'),
      },
      {
        blockType: 'socialLinks',
        heading: 'Follow',
        links: [
          {
            label: 'Instagram',
            url: 'https://instagram.com/',
            newTab: true,
          },
          {
            label: 'YouTube',
            url: 'https://youtube.com/',
            newTab: true,
          },
          {
            label: 'Spotify',
            url: 'https://open.spotify.com/',
            newTab: true,
          },
        ],
      },
    ],
  }
}
