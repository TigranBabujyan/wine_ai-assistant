'use client'

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { Toaster } from '@/components/ui/sonner'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0A0A0F' }}>
      {/* Animated background blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full blur-[120px]"
          style={{ background: 'rgba(139,34,82,0.12)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px]"
          style={{ background: 'rgba(88,28,135,0.08)' }}
        />
        <div
          className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[100px]"
          style={{ background: 'rgba(201,168,76,0.05)' }}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:shrink-0 relative z-20">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />

      <Toaster richColors position="top-right" />
    </div>
  )
}
