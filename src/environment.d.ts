declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CRON_SECRET: string
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      PREVIEW_SECRET: string
      R2_ACCESS_KEY_ID: string
      R2_BUCKET: string
      R2_ENDPOINT: string
      R2_FORCE_PATH_STYLE: string
      R2_PUBLIC_URL: string
      R2_REGION: string
      R2_SECRET_ACCESS_KEY: string
      S3_ACCESS_KEY_ID: string
      S3_BUCKET: string
      S3_ENDPOINT: string
      S3_FORCE_PATH_STYLE: string
      S3_PUBLIC_URL: string
      S3_REGION: string
      S3_SECRET_ACCESS_KEY: string
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
