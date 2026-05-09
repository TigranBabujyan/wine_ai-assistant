import Link from 'next/link'
import { Wine } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Wine AI',
  description: 'Privacy policy for Wine AI Assistant.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-3xl mx-auto backdrop-blur-sm bg-background/80 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Wine className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Wine AI</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p>Last updated: May 2025</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
          <p>When you create an account, we store your email address and the wines you save to your journal. We also store records of label scans (without the original image) for your history.</p>
          <p>We do not collect payment information, device identifiers, or browsing history outside of this application.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">How AI works</h2>
          <p>Wine AI uses Groq&apos;s inference API to power search and label scanning. Your search queries and label images are sent to Groq for processing. Groq&apos;s privacy policy applies to that processing. We do not store your raw queries or images beyond what is shown in your journal.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Data storage</h2>
          <p>Your account data is stored in Supabase (PostgreSQL) hosted in the EU. All data is protected by Row Level Security — only you can read your own records.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
          <p>We use Vercel Analytics to measure page traffic. This collects aggregated, anonymous usage data. No personal identifiers or cookies are used for analytics.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
          <p>You can delete your account and all associated data at any time by contacting us. We will remove your data within 30 days of request.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p>Questions about this policy? Email us at <span className="text-foreground font-medium">hello@wineai.app</span></p>
        </section>

        <div className="pt-8 border-t border-border/40">
          <Link href="/" className="text-primary hover:underline">← Back to Wine AI</Link>
        </div>
      </main>
    </div>
  )
}
