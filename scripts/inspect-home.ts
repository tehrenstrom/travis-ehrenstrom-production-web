import configPromise from '@payload-config'
import { getPayload } from 'payload'

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  const page = result.docs?.[0]
  console.log({
    id: page?.id,
    updatedAt: page?.updatedAt,
    hero: page?.hero,
  })
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
