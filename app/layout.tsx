import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TLV Business Pulse - Real-Time Tel Aviv Business Directory',
  description: 'The world\'s first fully autonomous business directory. Track new businesses, closures, and trends in Tel Aviv with AI-powered insights.',
  keywords: ['Tel Aviv', 'business directory', 'autonomous', 'AI', 'startup', 'local business'],
  authors: [{ name: 'Autonomous Business Development Foundation' }],
  openGraph: {
    title: 'TLV Business Pulse',
    description: 'Real-time autonomous business intelligence for Tel Aviv',
    type: 'website',
    url: 'https://tlv-business-pulse.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TLV Business Pulse',
    description: 'Real-time autonomous business intelligence for Tel Aviv',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
