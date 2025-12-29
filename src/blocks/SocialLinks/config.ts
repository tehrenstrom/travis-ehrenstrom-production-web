import type { Block } from 'payload'

export const SocialLinks: Block = {
  slug: 'socialLinks',
  interfaceName: 'SocialLinksBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
        },
      ],
      maxRows: 8,
    },
  ],
  labels: {
    plural: 'Social Links Blocks',
    singular: 'Social Links Block',
  },
}
