/**
 * Minimal Lexical rich-text builders for seed scripts (same node shapes as
 * seedMailingList.ts / scripts/seed-booking-page.ts).
 */

export const textNode = (text: string, format = 0) => ({
  type: 'text' as const,
  detail: 0,
  format,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

export const paragraphNode = (children: ReturnType<typeof textNode>[]) => ({
  type: 'paragraph' as const,
  children,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const paragraph = (text: string) => paragraphNode([textNode(text)])

export const headingNode = (text: string, tag: 'h1' | 'h2' | 'h3' = 'h2') => ({
  type: 'heading' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

export const richText = (
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
