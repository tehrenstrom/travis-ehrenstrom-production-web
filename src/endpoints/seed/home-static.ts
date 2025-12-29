import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root' as const,
        children: [
          {
            type: 'heading' as const,
            children: [
              {
                type: 'text' as const,
                detail: 0,
                format: 0,
                mode: 'normal' as const,
                style: '',
                text: 'Travis Ehrenstrom',
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: '' as const,
            indent: 0,
            tag: 'h1' as const,
            version: 1,
          },
          {
            type: 'paragraph' as const,
            children: [
              {
                type: 'text' as const,
                detail: 0,
                format: 0,
                mode: 'normal' as const,
                style: '',
                text: 'Log in to the admin to add your hero, music, and shows.',
                version: 1,
              },
            ],
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
    },
  },
  title: 'Home',
  layout: [],
}
