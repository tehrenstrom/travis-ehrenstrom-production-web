import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Release } from '../../../payload-types'

export const revalidateRelease: CollectionAfterChangeHook<Release> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const listPath = '/music'

    if (doc._status === 'published') {
      const path = `/music/${doc.slug}`

      payload.logger.info(`Revalidating release at path: ${path}`)

      revalidatePath(path)
      revalidatePath(listPath)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/music/${previousDoc.slug}`

      payload.logger.info(`Revalidating old release at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath(listPath)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Release> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/music/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/music')
  }

  return doc
}
