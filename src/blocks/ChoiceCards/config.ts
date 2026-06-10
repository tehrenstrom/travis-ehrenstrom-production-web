import type { Block } from 'payload'

import { link } from '@/fields/link'

/**
 * Two-up (or three-up) chooser cards — the "Pick your room" pattern: one
 * songwriter, two ways to hear it. Used on the home page and the /booking
 * chooser; reusable for album-era companion rows.
 */
export const ChoiceCards: Block = {
  slug: 'choiceCards',
  interfaceName: 'ChoiceCardsBlock',
  labels: {
    plural: 'Choice Cards',
    singular: 'Choice Cards',
  },
  fields: [
    {
      name: 'kicker',
      type: 'text',
      admin: {
        description: 'Mono eyebrow above the heading (e.g. "One songwriter, two ways to hear it")',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading (e.g. "Pick your room")',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Optional short intro under the heading',
      },
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'tag',
          type: 'text',
          admin: {
            description: 'Small pill label (e.g. "Solo" or "TEB")',
          },
        },
        {
          name: 'body',
          type: 'textarea',
        },
        link({ appearances: false }),
      ],
    },
  ],
}
