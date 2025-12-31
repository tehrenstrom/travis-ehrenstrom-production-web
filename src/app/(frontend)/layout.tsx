import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Righteous, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getDefaultDescription, getSiteName, normalizeTwitterHandle } from '@/utilities/seo'

const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const display = Righteous({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(sans.variable, display.variable, mono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

const twitterHandle = normalizeTwitterHandle(process.env.NEXT_PUBLIC_TWITTER_HANDLE)

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: getSiteName(),
    template: `%s | ${getSiteName()}`,
  },
  description: getDefaultDescription(),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    ...(twitterHandle
      ? {
          creator: twitterHandle,
          site: twitterHandle,
        }
      : {}),
  },
}
