import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Abril_Fatface, JetBrains_Mono, Nunito } from 'next/font/google'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import Script from 'next/script'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getDefaultDescription, getSiteName, normalizeTwitterHandle } from '@/utilities/seo'

const sans = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const display = Abril_Fatface({
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
        <Script
          id="gtag-script"
          src="https://www.googletagmanager.com/gtag/js?id=G-H88NRDQ5KP"
          strategy="afterInteractive"
        />
        <Script
          id="ga-initialization"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H88NRDQ5KP');
            `,
          }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KS9BSLKH');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            height="0"
            src="https://www.googletagmanager.com/ns.html?id=GTM-KS9BSLKH"
            style={{ display: 'none', visibility: 'hidden' }}
            width="0"
          ></iframe>
        </noscript>
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
