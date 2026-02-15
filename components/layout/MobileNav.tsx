'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Camera, BookOpen, Trophy, LayoutDashboard, Settings, Menu, X, Wine, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/api/supabase'

const bottomItems = [
  { href: '/dashboard', label: 'Home',    icon: LayoutDashboard },
  { href: '/search',    label: 'Search',  icon: Search },
  { href: '/scan',      label: 'Scan',    icon: Camera },
  { href: '/journal',   label: 'Journal', icon: BookOpen },
]

const drawerItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/search',       label: 'AI Search',    icon: Search },
  { href: '/scan',         label: 'Scan Label',   icon: Camera },
  { href: '/journal',      label: 'My Journal',   icon: BookOpen },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings',     label: 'Settings',     icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.7)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
              style={{ color: isActive ? 'var(--wine-400)' : 'rgba(255,255,255,0.35)' }}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}

        {/* Burger button */}
        <button
          onClick={() => setOpen(true)}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
          style={{ color: open ? 'var(--wine-400)' : 'rgba(255,255,255,0.35)' }}
        >
          <Menu className="w-5 h-5" />
          More
        </button>
      </nav>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className="fixed top-0 right-0 h-full w-72 z-[70] md:hidden flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          backdropFilter: 'blur(24px)',
          background: 'rgba(10,10,15,0.95)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md" style={{ background: 'rgba(139,34,82,0.5)' }} />
              <Wine className="w-6 h-6 relative z-10" style={{ color: 'var(--wine-400)' }} />
            </div>
            <span className="text-lg font-medium text-gradient" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sommelier
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {drawerItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 border-l-2"
                style={isActive ? {
                  background: 'linear-gradient(to right, rgba(139,34,82,0.2), transparent)',
                  borderLeftColor: 'var(--wine-500)',
                  color: '#fff',
                } : {
                  borderLeftColor: 'transparent',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 pb-8 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium w-full transition-all hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
