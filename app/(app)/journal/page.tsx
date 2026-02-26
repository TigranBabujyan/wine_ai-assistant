'use client'

import { useState } from 'react'
import { useJournal } from '@/lib/hooks/useJournal'
import { BookOpen, Search, Wine, ArrowRight, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { WineStyle } from '@/types/wine.types'
import { motion } from 'framer-motion'

const styleBar: Record<string, string> = {
  red:      'linear-gradient(to right, #8B2252, #C45080)',
  white:    'linear-gradient(to right, #A8883A, #C9A84C)',
  'rosé':   'linear-gradient(to right, #DB2777, #F472B6)',
  sparkling:'linear-gradient(to right, #7C3AED, #A78BFA)',
  dessert:  'linear-gradient(to right, #A8883A, #C9A84C)',
}
const styleDot: Record<string, string> = {
  red: '#8B2252', white: '#C9A84C', 'rosé': '#EC4899', sparkling: '#8B5CF6', dessert: '#C9A84C',
}

export default function JournalPage() {
  const { wines, loading, deleteWine } = useJournal()
  const [search, setSearch] = useState('')
  const [styleFilter, setStyleFilter] = useState<WineStyle | 'all'>('all')
  const [sort, setSort] = useState<'newest' | 'oldest' | 'name'>('newest')

  let filtered = wines.filter(w => {
    const matchesSearch = !search ||
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.producer?.toLowerCase().includes(search.toLowerCase()) ||
      w.region?.toLowerCase().includes(search.toLowerCase())
    const matchesStyle = styleFilter === 'all' || w.style === styleFilter
    return matchesSearch && matchesStyle
  })
  if (sort === 'oldest') filtered = [...filtered].reverse()
  if (sort === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-medium text-gradient mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Wine Journal
          </h1>
          <div className="h-px w-24" style={{ background: 'linear-gradient(to right, var(--wine-500), transparent)' }} />
        </div>
        <div className="px-4 py-1.5 rounded-full text-sm font-medium glass-card" style={{ color: 'var(--wine-400)', borderColor: 'rgba(139,34,82,0.2)' }}>
          {wines.length} {wines.length === 1 ? 'wine' : 'wines'} saved
        </div>
      </motion.div>

      {/* Filters */}
      {wines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-2xl p-5 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, producer, region..."
              className="pl-12 h-12 text-base rounded-xl border-white/[0.05] bg-white/[0.02] placeholder:text-white/20 focus-visible:border-wine-500/50"
            />
          </div>
          <Select value={styleFilter} onValueChange={v => setStyleFilter(v as WineStyle | 'all')}>
            <SelectTrigger className="w-40 h-12 rounded-xl border-white/[0.05] bg-white/[0.02]">
              <SelectValue placeholder="All styles" />
            </SelectTrigger>
            <SelectContent className="border-white/[0.05]" style={{ background: '#151520' }}>
              <SelectItem value="all">All styles</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="rosé">Rosé</SelectItem>
              <SelectItem value="sparkling">Sparkling</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={v => setSort(v as typeof sort)}>
            <SelectTrigger className="w-44 h-12 rounded-xl border-white/[0.05] bg-white/[0.02]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/[0.05]" style={{ background: '#151520' }}>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">By name</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      )}

      {/* Wine grid */}
      {!loading && filtered.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((wine, i) => {
            const bar = styleBar[wine.style ?? 'red'] ?? styleBar.red
            const dot = styleDot[wine.style ?? 'red'] ?? styleDot.red
            return (
              <motion.div
                key={wine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -6 }}
                layout
              >
                <div className="h-full flex flex-col rounded-2xl overflow-hidden glass-card-hover group relative">
                  <div className="h-0.5 w-full transition-all duration-500 opacity-60 group-hover:opacity-100" style={{ background: bar }} />
                  <div className="p-5 flex-1 flex flex-col relative">
                    {/* Delete on hover */}
                    <button
                      onClick={() => deleteWine(wine.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full hover:bg-red-500/10"
                      style={{ color: 'rgba(255,255,255,0.2)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: dot }} />
                      <span className="text-xs font-medium uppercase tracking-wider text-white/40">{wine.style}</span>
                    </div>

                    <h3 className="font-medium text-lg mb-1 pr-7 text-white group-hover:text-white/90 transition-colors leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {wine.name}
                    </h3>
                    {wine.producer && <p className="text-sm text-white/40 mb-5">{wine.producer}</p>}

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/30">{wine.region}</span>
                        <span className="text-white/60 font-medium">{wine.vintage}</span>
                      </div>
                      <Link href={`/wine/${wine.id}`}>
                        <button className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 group/btn transition-all"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}>
                          View Details
                          <ArrowRight className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && wines.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center relative"
        >
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(139,34,82,0.06), transparent 70%)' }} />
          <Wine className="w-20 h-20 text-white/10 mb-6 animate-float" strokeWidth={1} />
          <h2 className="text-3xl font-medium mb-3 text-gradient" style={{ fontFamily: 'Playfair Display, serif' }}>Your journal is empty</h2>
          <p className="text-white/40 max-w-md mb-10 text-lg">Start building your collection by searching for wines or scanning labels.</p>
          <div className="flex gap-4">
            <Link href="/search">
              <button className="px-8 py-3 rounded-full text-white font-medium transition-all"
                style={{ background: 'linear-gradient(to right, var(--wine-600), var(--wine-800))', boxShadow: '0 0 20px rgba(139,34,82,0.25)' }}>
                Search Wines
              </button>
            </Link>
            <Link href="/scan">
              <button className="px-8 py-3 rounded-full font-medium glass-card transition-all hover:bg-white/10">
                Scan Label
              </button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* No results after filter */}
      {!loading && wines.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 text-white/40">
          <p className="font-medium">No wines match your filter</p>
          <button onClick={() => { setSearch(''); setStyleFilter('all') }} className="text-sm mt-2 transition-colors" style={{ color: 'var(--wine-400)' }}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
