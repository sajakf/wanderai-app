import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WanderAI — Your AI Travel Companion',
  description: 'Pack light. Dream heavy. AI-powered trips built around your budget.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'WanderAI' },
  openGraph: {
    title: 'WanderAI',
    description: 'Pack light. Dream heavy.',
    url: 'https://app.thewanderlust.app',
    siteName: 'WanderAI',
  },
  metadataBase: new URL('https://app.thewanderlust.app'),
}

export const viewport: Viewport = {
  themeColor: '#0D2B35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="bg-ocean-900 text-cream antialiased">{children}</body>
    </html>
  )
}
