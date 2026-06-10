import type { Block } from 'payload'

/**
 * CMS-placeable wrapper around the site-wide CaptureForm component (which
 * POSTs straight to /mailing-list/subscribe -> Google Sheet). The Payload
 * form builder can't replicate its placeholders, direct Sheet POST, or
 * per-placement GTM conversion events, hence a dedicated block.
 */
export const CaptureFormBlock: Block = {
  slug: 'captureForm',
  interfaceName: 'CaptureFormBlock',
  labels: {
    plural: 'Capture Forms',
    singular: 'Capture Form',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Stay in the loop',
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'placement',
      type: 'text',
      defaultValue: 'page',
      admin: {
        description:
          'Sent with the mailing_list_signup analytics event so conversions can be tracked per location (e.g. "home", "list_page")',
      },
    },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'plain',
      options: [
        { label: 'Plain', value: 'plain' },
        { label: 'Sunset band', value: 'sunset' },
      ],
    },
  ],
}
