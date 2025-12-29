import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ContactArgs = {
  contactForm: Form
}

const textNode = (text: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
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

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: buildRichText('Connect', 'Booking, press, and general inquiries.'),
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: buildRichText(
              'Booking & Press',
              'For booking, house shows, or press inquiries, use the form below or email hello@travisehrenstrom.com.',
            ),
          },
        ],
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
      {
        blockType: 'formBlock',
        enableIntro: true,
        form: contactForm,
        introContent: buildRichText('Send a message', 'We read every note and reply quickly.'),
      },
    ],
    title: 'Connect',
  }
}
