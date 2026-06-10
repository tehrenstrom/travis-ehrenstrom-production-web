import { revalidatePath as nextRevalidatePath, revalidateTag as nextRevalidateTag } from 'next/cache'

/**
 * Next.js `revalidatePath` / `revalidateTag` only work inside a request/render
 * context. Payload `afterChange`/`afterDelete` hooks also fire when content is
 * mutated OUTSIDE a request — seed scripts, content imports, cron jobs — where
 * `revalidatePath` throws `Invariant: static generation store missing`.
 *
 * These wrappers swallow that out-of-context error so background mutations don't
 * crash. Inside a real request nothing is thrown, so behavior is unchanged.
 */
export const revalidatePath = (path: string): void => {
  try {
    nextRevalidatePath(path)
  } catch {
    // Not in a Next.js request context (e.g. a CLI/seed script) — safe to skip.
  }
}

export const revalidateTag = (tag: string): void => {
  try {
    nextRevalidateTag(tag)
  } catch {
    // Not in a Next.js request context (e.g. a CLI/seed script) — safe to skip.
  }
}
