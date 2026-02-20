'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SearchBar } from '@/components/features/search/SearchBar'
import { StreamingThought } from '@/components/features/search/StreamingThought'
import { WineCardSkeleton } from '@/components/features/wine/WineCard'
import { useWineSearch } from '@/lib/hooks/useWineSearch'
import { useJournal } from '@/lib/hooks/useJournal'
import { WinePartial, WineStyle } from '@/types/wine.types'
import { AlertCircle, Sparkles, Wine, Heart, Star, BookmarkPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  )
}

const exampleQueries = [
  'Bold red with steak',
  'Crisp white under €20',
  'Italian wine for pasta',
  'Celebratory champagne',
  'Easy summer rosé',
]

const styleBar: Record<WineStyle | string, string> = {
  red:      'linear-gradient(to right, #8B2252, #C45080)',
  white:    'linear-gradient(to right, #A8883A, #C9A84C)',
  'rosé':   'linear-gradient(to right, #DB2777, #F472B6)',
  sparkling:'linear-gradient(to right, #7C3AED, #A78BFA)',
  dessert:  'linear-gradient(to right, #A8883A, #C9A84C)',
}
const styleDot: Record<WineStyle | string, string> = {
  red: '#8B2252', white: '#C9A84C', 'rosé': '#EC4899', sparkling: '#8B5CF6', dessert: '#C9A84C',
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { search, searchResults, searchQuery, searchLoading, searchError, streamBuffer } = useWineSearch()
  const { saveWine } = useJournal()

  const qParam = searchParams.get('q')
  useEffect(() => {
    if (qParam) search(qParam)
  }, [qParam]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
    search(query)
  }

  const handleSave = async (wine: WinePartial) => {
    const saved = await saveWine(wine)
    if (saved) toast.success('Saved to journal!')
  }

  const hasResults = !searchLoading && searchResults.length > 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero search area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={hasResults ? 'pt-4' : 'pt-16 pb-8'}
      >
        {!hasResults && !searchLoading && (
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl font-medium mb-4 text-gradient tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Ask Your Sommelier
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              Describe what you&apos;re looking for, what you&apos;re eating, or a vibe you want to match.
            </p>
          </div>
        )}

        {/* Search bar */}
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(139,34,82,0.15)' }} />
          <div className="relative flex items-center glass-card rounded-full overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <Sparkles className={`absolute left-5 w-5 h-5 z-10 transition-all duration-300 ${searchLoading ? 'animate-pulse-glow' : ''}`} style={{ color: 'var(--wine-400)' }} />
            <input
              type="text"
              defaultValue={qParam ?? ''}
              key={qParam ?? 'empty'}
              placeholder="Describe a wine... bold red for steak, light Italian white..."
              className="w-full bg-transparent pl-14 pr-36 py-5 text-base text-white placeholder:text-white/25 outline-none"
              onKeyDown={e => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
            />
            <button
              onClick={e => handleSearch((e.currentTarget.closest('.relative')!.querySelector('input') as HTMLInputElement).value)}
              disabled={searchLoading}
              className="absolute right-2 px-7 py-3 rounded-full text-white font-medium text-sm transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(to right, var(--wine-600), var(--wine-800))', boxShadow: '0 0 20px rgba(139,34,82,0.3)' }}
            >
              {searchLoading ? 'Thinking...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Example chips */}
        {!hasResults && !searchLoading && (
          <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-2xl mx-auto">
            {exampleQueries.map((q, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => handleSearch(q)}
                className="px-4 py-2 rounded-full text-sm glass-card hover:bg-white/[0.08] text-white/50 hover:text-white transition-all duration-300"
              >
                {q}
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Streaming thought */}
      <StreamingThought text={streamBuffer} visible={searchLoading && streamBuffer.length > 0} />

      {/* Loading skeletons */}
      {searchLoading && streamBuffer.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <WineCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {searchError && !searchLoading && (
        <div className="flex items-center gap-3 p-4 rounded-2xl text-red-400" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{searchError}</p>
        </div>
      )}

      {/* Results grid */}
      {hasResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-white/40 mb-6">
            {searchResults.length} wines found{searchQuery && <> for &ldquo;<span className="text-white/70">{searchQuery}</span>&rdquo;</>}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((wine, i) => {
              const bar = styleBar[wine.style ?? 'red'] ?? styleBar.red
              const dot = styleDot[wine.style ?? 'red'] ?? styleDot.red
              return (
                <motion.div
                  key={`${wine.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="h-full flex flex-col rounded-3xl overflow-hidden glass-card-hover group relative">
                    <div className="h-0.5 w-full" style={{ background: bar }} />
                    <div className="p-7 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: dot }} />
                          <span className="text-xs font-medium uppercase tracking-wider text-white/40">{wine.style}</span>
                        </div>
                        {wine.vintage && <span className="text-sm font-medium text-white/30">{wine.vintage}</span>}
                      </div>

                      <h3 className="text-2xl font-medium mb-1 text-white group-hover:text-white/90 transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {wine.name}
                      </h3>
                      <p className="text-sm text-white/40 mb-5">
                        {[wine.producer, wine.region, wine.country].filter(Boolean).join(' · ')}
                      </p>

                      {wine.variety && wine.variety.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {wine.variety.map((v, j) => (
                            <span key={j} className="text-xs px-3 py-1.5 rounded-full text-white/60"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              {v}
                            </span>
                          ))}
                        </div>
                      )}

                      {wine.description && (
                        <p className="text-sm text-white/40 line-clamp-2 mb-5 flex-1">{wine.description}</p>
                      )}

                      {wine.why_recommended && (
                        <p className="text-xs font-medium mb-5 mt-auto" style={{ color: 'var(--wine-400)' }}>{wine.why_recommended}</p>
                      )}

                      <div className="pt-5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        {wine.price_range && (
                          <span className="text-xs px-2 py-1 rounded-md capitalize text-white/50"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            {wine.price_range}
                          </span>
                        )}
                        <button
                          onClick={() => handleSave(wine)}
                          className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors group/btn ml-auto"
                        >
                          <BookmarkPlus className="w-5 h-5" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!searchLoading && searchResults.length === 0 && !searchError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex-1 flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: 'rgba(139,34,82,0.15)' }} />
            <Wine className="w-24 h-24 text-white/10 relative z-10 animate-float-slow" strokeWidth={0.8} />
          </div>
          <p className="text-2xl font-medium text-white/20" style={{ fontFamily: 'Playfair Display, serif' }}>Your sommelier awaits</p>
        </motion.div>
      )}
    </div>
  )
}
