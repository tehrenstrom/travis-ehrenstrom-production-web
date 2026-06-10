/**
 * Export all CMS content to JSON under content-backup/ so the repo (git) is a durable
 * backup of the database. Pairs with a scheduled GitHub Action (.github/workflows/
 * content-backup.yml). Media binaries live in Cloudflare R2 — this captures the docs
 * (including their R2 filenames), not the bytes.
 *
 * Run: node --env-file=.env <tsx> scripts/export-content.ts   (or: pnpm export:content)
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'content-backup'
const COLLECTIONS = [
  'pages', 'posts', 'shows', 'releases', 'products', 'media', 'categories', 'forms', 'form-submissions',
] as const
const GLOBALS = ['header', 'footer'] as const

const payload = await getPayload({ config })
fs.mkdirSync(OUT, { recursive: true })

const manifest: { exportedAt: string; collections: Record<string, number>; globals: string[] } = {
  exportedAt: new Date().toISOString(),
  collections: {},
  globals: [],
}

for (const collection of COLLECTIONS) {
  const docs: unknown[] = []
  let page = 1
  for (;;) {
    const res = await payload.find({ collection, depth: 0, limit: 200, page, pagination: true, overrideAccess: true })
    docs.push(...res.docs)
    if (!res.hasNextPage) break
    page++
  }
  fs.writeFileSync(path.join(OUT, `${collection}.json`), JSON.stringify(docs, null, 2))
  manifest.collections[collection] = docs.length
}

for (const slug of GLOBALS) {
  const doc = await payload.findGlobal({ slug, depth: 0, overrideAccess: true })
  fs.writeFileSync(path.join(OUT, `global-${slug}.json`), JSON.stringify(doc, null, 2))
  manifest.globals.push(slug)
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
console.log('✅ content exported ->', OUT)
console.log(JSON.stringify(manifest.collections))
await payload.destroy?.()
process.exit(0)
