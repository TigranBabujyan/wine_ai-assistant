import { Wine, Search, Camera, BookOpen } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: visual panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Wine className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-primary-foreground">Wine AI</span>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-primary-foreground leading-snug">
              Your personal<br />AI sommelier.
            </h2>
            <p className="text-primary-foreground/70 mt-3 leading-relaxed">
              Discover wines with natural language, scan labels, and build your personal journal.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Search, text: 'Search by mood, occasion, or taste' },
              { icon: Camera, text: 'Scan any wine label instantly' },
              { icon: BookOpen, text: 'Build your personal wine journal' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-primary-foreground/80">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-foreground/40 text-xs">
          Portfolio project · Built with Next.js & Claude AI
        </p>
      </div>

      {/* Right: auth form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        {children}
      </div>
    </div>
  )
}
