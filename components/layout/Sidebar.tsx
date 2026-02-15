'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, Camera, BookOpen, Trophy, Settings, Wine, LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/lib/api/supabase'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/search',    label: 'AI Search',   icon: Search },
  { href: '/scan',      label: 'Scan Label',  icon: Camera },
  { href: '/journal',   label: 'My Journal',  icon: BookOpen },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings',  label: 'Settings',    icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside
      className="flex flex-col h-full w-64"
      style={{
        backdropFilter: 'blur(24px)',
        background: 'rgba(0,0,0,0.4)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-md" style={{ background: 'rgba(139,34,82,0.4)' }} />
          <Wine className="w-7 h-7 relative z-10" style={{ color: 'var(--wine-400)' }} />
        </div>
        <span className="text-xl font-medium tracking-tight text-gradient" style={{ fontFamily: 'Playfair Display, serif' }}>
          Sommelier
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'text-white border-l-2'
                  : 'text-white/50 hover:text-white/80 border-l-2 border-transparent'
              )}
              style={isActive ? {
                background: 'linear-gradient(to right, rgba(139,34,82,0.2), transparent)',
                borderLeftColor: 'var(--wine-500)',
              } : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-4 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
