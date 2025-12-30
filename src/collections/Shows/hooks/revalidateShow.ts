import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Show } from '../../../payload-types'

export const revalidateShow: CollectionAfterChangeHook<Show> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const listPath = '/shows'

    if (doc._status === 'published') {
      const path = `/shows/${doc.slug}`

      payload.logger.info(`Revalidating show at path: ${path}`)

      revalidatePath(path)
      revalidatePath(listPath)
      revalidateTag('shows-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/shows/${previousDoc.slug}`

      payload.logger.info(`Revalidating old show at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath(listPath)
      revalidateTag('shows-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Show> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/shows/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/shows')
    revalidateTag('shows-sitemap')
  }

  return doc
}
