import React from 'react'
import { generateStructuredData, SchemaType } from '@/utilities/structuredData'

export const StructuredData: React.FC<{
  doc?: any
  type?: SchemaType
}> = ({ doc, type }) => {
  const schema = generateStructuredData(doc, type)

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  )
}

