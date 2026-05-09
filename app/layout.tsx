import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Wine AI — Your Personal AI Sommelier',
  description: 'Discover wines with natural language, scan labels instantly, and build your personal wine journal. Powered by AI.',
  keywords: ['wine', 'AI sommelier', 'wine scanner', 'wine journal', 'wine discovery'],
  openGraph: {
    title: 'Wine AI — Your Personal AI Sommelier',
    description: 'Discover wines with natural language, scan labels instantly, and build your personal wine journal.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wine AI — Your Personal AI Sommelier',
    description: 'Discover wines with natural language, scan labels instantly, and build your personal wine journal.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
