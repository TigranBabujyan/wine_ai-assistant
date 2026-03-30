import { redirect } from 'next/navigation'
import { createClient } from '@/lib/api/supabase-server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wine, Search, Camera, BookOpen, Trophy, ArrowRight, Sparkles, Shield, Star, Check } from 'lucide-react'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto backdrop-blur-sm bg-background/80 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Wine className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Wine AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth">
            <Button size="sm" className="hidden sm:flex">Get Started Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28 text-center">
          <Badge variant="secondary" className="mb-5 gap-1.5 inline-flex items-center text-xs font-medium">
            <Sparkles className="w-3 h-3" /> AI Powered
          </Badge>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your personal<br />
            <span className="text-primary">AI sommelier</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover wines with natural language, scan labels with your camera, and build a journal of everything you&apos;ve tasted. Powered by the latest AI models.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/auth">
              <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg shadow-primary/20">
                Start for Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base">
                <Camera className="w-4 h-4" /> Scan a Label
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Free to use</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Your own API key</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> No subscription</span>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything you need to explore wine</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Three powerful tools, one seamless experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: 'Natural Language Search',
              desc: 'Ask for "bold reds under €20" or "wine similar to Rioja" and get expert recommendations with full tasting profiles.',
              badge: 'AI Search',
              color: 'bg-primary/10 text-primary',
              detail: 'Fast language model',
            },
            {
              icon: Camera,
              title: 'Label Scanner',
              desc: 'Point your camera at any label. AI Vision extracts name, region, vintage, tasting notes, and food pairings instantly.',
              badge: 'Vision AI',
              color: 'bg-accent/20 text-accent-foreground',
              detail: 'Multimodal vision model',
            },
            {
              icon: BookOpen,
              title: 'Personal Journal',
              desc: 'Save wines, add tasting notes, star ratings, and occasion notes. Track your journey with an achievement system.',
              badge: 'Your Collection',
              color: 'bg-muted text-muted-foreground',
              detail: 'Supabase PostgreSQL',
            },
          ].map(({ icon: Icon, title, desc, badge, color, detail }) => (
            <div key={title} className="group relative bg-card border rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/3 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-xs">{badge}</Badge>
              </div>
              <h3 className="relative font-semibold text-lg">{title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <p className="relative text-xs text-muted-foreground/60 font-mono">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — search demo */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <h2 className="font-semibold text-lg">See it in action</h2>
            <p className="text-sm text-muted-foreground mt-1">Type what you&apos;re looking for — no wine knowledge required.</p>
          </div>
          <div className="p-6 space-y-4">
            {/* Fake search UI */}
            <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 shadow-sm">
              <div className="relative shrink-0">
                <Search className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-muted-foreground text-sm flex-1">light Italian white wine for seafood under €20</span>
              <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg">Search</span>
            </div>

            {/* Sample result cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Pinot Grigio delle Venezie', producer: 'Santa Margherita', region: 'Veneto, Italy', style: 'white', variety: 'Pinot Grigio' },
                { name: 'Vermentino di Sardegna', producer: 'Sella & Mosca', region: 'Sardinia, Italy', style: 'white', variety: 'Vermentino' },
                { name: 'Soave Classico', producer: 'Pieropan', region: 'Veneto, Italy', style: 'white', variety: 'Garganega' },
              ].map(w => (
                <div key={w.name} className="rounded-xl border bg-background p-4 space-y-2">
                  <div className="h-0.5 w-full bg-yellow-400 rounded" />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm leading-tight">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.producer}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0 bg-yellow-100 text-yellow-800">white</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{w.region}</p>
                  <Badge variant="outline" className="text-xs">{w.variety}</Badge>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Track your journey</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Earn achievements as you explore the world of wine. From your first saved bottle to becoming a World Traveler by sampling wines from three continents.
            </p>
            <Link href="/auth">
              <Button className="gap-2">
                Start earning <Trophy className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🍷', name: 'First Pour', desc: 'Save your first wine' },
              { icon: '📷', name: 'Label Detective', desc: 'Scan your first label' },
              { icon: '🌍', name: 'World Traveler', desc: 'Wines from 3 regions' },
              { icon: '✍️', name: 'The Journalist', desc: 'Write 10 tasting notes' },
            ].map(a => (
              <div key={a.name} className="bg-card border rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex flex-col sm:flex-row items-start gap-6 bg-muted/40 border rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Built with security in mind</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> API keys encrypted with pgp_sym_encrypt</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Keys never appear in HTTP responses</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Row Level Security on all database tables</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600 shrink-0" /> Server-side AI calls only — key stays server-side</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 text-center">
        <div className="bg-primary rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-primary-foreground mb-3">
            Ready to discover your next favourite wine?
          </h2>
          <p className="text-primary-foreground/70 mb-8">
            Free to use. Bring your own AI API key. No subscription.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="gap-2 h-12 px-8">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Wine className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Wine AI Assistant</span>
          </div>
          <p>Built with Next.js, Supabase, and AI. A portfolio project.</p>
          <div className="flex gap-4">
            <Link href="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
            <Link href="/auth" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
