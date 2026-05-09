'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Wine, Camera, Trophy, Sparkles, ArrowRight } from 'lucide-react'
import { WineFull } from '@/types/wine.types'

const statIcons = { wine: Wine, gold: Camera, emerald: Trophy }

interface Stat {
  label: string
  value: number
  color: 'wine' | 'gold' | 'emerald'
  href: string
}

interface Props {
  firstName: string
  stats: Stat[]
  recentWines: WineFull[]
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const styleColor = (style: string) => {
  if (style === 'red') return { dot: '#8B2252', bar: 'linear-gradient(to right, #8B2252, #C45080)' }
  if (style === 'white') return { dot: '#C9A84C', bar: 'linear-gradient(to right, #A8883A, #C9A84C)' }
  if (style === 'rosé') return { dot: '#EC4899', bar: 'linear-gradient(to right, #DB2777, #F472B6)' }
  if (style === 'sparkling') return { dot: '#8B5CF6', bar: 'linear-gradient(to right, #7C3AED, #A78BFA)' }
  return { dot: '#C9A84C', bar: 'linear-gradient(to right, #A8883A, #C9A84C)' }
}

const statColors = {
  wine:    { bg: 'rgba(139,34,82,0.1)', border: 'rgba(139,34,82,0.2)', text: 'var(--wine-400)', glow: 'rgba(139,34,82,0.15)', line: '#8B2252' },
  gold:    { bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.2)', text: '#C9A84C', glow: 'rgba(201,168,76,0.12)', line: '#C9A84C' },
  emerald: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#10B981', glow: 'rgba(16,185,129,0.12)', line: '#10B981' },
}

export default function DashboardClient({ firstName, stats, recentWines }: Props) {
  return (
    <motion.div
      className="space-y-10 max-w-6xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl p-10 md:p-14"
        style={{
          background: 'linear-gradient(135deg, rgba(139,34,82,0.25) 0%, rgba(10,10,15,0) 60%)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[80px]" style={{ background: 'rgba(139,34,82,0.15)' }} />
        </div>
        {/* Floating wine glasses */}
        <div className="absolute top-8 right-12 opacity-10 animate-float-slow pointer-events-none hidden md:block">
          <Wine className="w-20 h-20 text-white" strokeWidth={0.8} />
        </div>
        <div className="absolute bottom-6 right-32 opacity-[0.06] animate-float pointer-events-none hidden md:block">
          <Wine className="w-12 h-12 text-white" strokeWidth={0.8} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-medium mb-3 text-gradient">
            Good evening, {firstName} <span className="inline-block animate-float-slow">🍷</span>
          </h1>
          <p className="text-lg text-white/50">Ready to discover your next favorite wine?</p>
          <div className="mt-6 h-px w-24" style={{ background: 'linear-gradient(to right, #C9A84C, transparent)' }} />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map(({ label, value, color, href }) => {
          const Icon = statIcons[color]
          const c = statColors[color]
          return (
            <Link key={label} href={href}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative rounded-2xl overflow-hidden p-6 flex items-center gap-5 glass-card-hover group cursor-pointer"
              >
                <div className="absolute top-0 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${c.line}, transparent)`, opacity: 0.6 }} />
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
                  style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 30px ${c.glow}` }}>
                  <Icon className="w-6 h-6" style={{ color: c.text }} />
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">{label}</p>
                  <p className="text-3xl font-medium text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{value}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all ml-auto" />
              </motion.div>
            </Link>
          )
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/search">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-3xl p-8 flex items-center justify-between group cursor-pointer transition-all duration-500"
            style={{ borderColor: 'rgba(139,34,82,0.3)' }}
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center glow-burgundy group-hover:scale-110 transition-transform duration-500"
                style={{ background: 'rgba(139,34,82,0.2)' }}>
                <Sparkles className="w-8 h-8 animate-pulse-glow" style={{ color: 'var(--wine-400)' }} />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Search Wines</h3>
                <p className="text-white/40">Ask your AI sommelier</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" style={{ color: 'var(--wine-400)' }} />
          </motion.div>
        </Link>

        <Link href="/scan">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card rounded-3xl p-8 flex items-center justify-between group cursor-pointer transition-all duration-500"
            style={{ borderColor: 'rgba(201,168,76,0.3)' }}
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center glow-gold group-hover:scale-110 transition-transform duration-500"
                style={{ background: 'rgba(201,168,76,0.15)' }}>
                <Camera className="w-8 h-8" style={{ color: '#C9A84C' }} />
              </div>
              <div>
                <h3 className="text-2xl font-medium text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Scan Label</h3>
                <p className="text-white/40">Identify any wine instantly</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" style={{ color: '#C9A84C' }} />
          </motion.div>
        </Link>
      </motion.div>

      {/* Recent Wines */}
      {recentWines.length > 0 && (
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-medium text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Recent Discoveries</h2>
              <div className="h-px w-12 hidden sm:block" style={{ background: 'linear-gradient(to right, #C9A84C, transparent)' }} />
            </div>
            <Link href="/journal" className="text-sm font-medium flex items-center gap-1 group transition-colors" style={{ color: 'var(--wine-400)' }}>
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-5 scrollbar-hide">
            {recentWines.map((wine, i) => {
              const c = styleColor(wine.style ?? '')
              return (
                <motion.div
                  key={wine.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="min-w-[240px] flex-shrink-0"
                >
                  <Link href={`/wine/${wine.id}`}>
                    <div className="glass-card-hover rounded-2xl overflow-hidden group cursor-pointer relative h-full">
                      <div className="h-0.5 w-full" style={{ background: c.bar }} />
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
                          <span className="text-xs font-medium uppercase tracking-wider text-white/40">{wine.style}</span>
                          <span className="text-xs text-white/30 ml-auto">{wine.vintage}</span>
                        </div>
                        <h3 className="font-medium text-lg text-white leading-tight mb-1 group-hover:text-white transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {wine.name}
                        </h3>
                        <p className="text-sm text-white/40">{wine.region}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {recentWines.length === 0 && (
        <motion.div variants={item} className="rounded-3xl p-12 text-center relative overflow-hidden glass-card">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139,34,82,0.08), transparent 70%)' }} />
          <Wine className="w-16 h-16 mx-auto mb-5 animate-float-slow text-white/10" strokeWidth={1} />
          <h3 className="text-2xl font-medium mb-2 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Start your wine journey</h3>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">Search for wines using natural language or scan a label to get started.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/search">
              <button className="px-8 py-3 rounded-full text-white font-medium transition-all"
                style={{ background: 'linear-gradient(to right, var(--wine-600), var(--wine-800))', boxShadow: '0 0 20px rgba(139,34,82,0.25)' }}>
                Search Wines
              </button>
            </Link>
            <Link href="/scan">
              <button className="px-8 py-3 rounded-full font-medium glass-card transition-all hover:bg-white/10">
                Scan a Label
              </button>
            </Link>
          </div>
        </motion.div>
      )}

    </motion.div>
  )
}
