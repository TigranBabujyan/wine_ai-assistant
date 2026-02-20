'use client'

import { useState, useRef, FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SUGGESTIONS = [
  'light red wine for pasta dinner',
  'fruity white wine under €20',
  'wine similar to Rioja',
  'bold Cabernet with steak',
  'sparkling wine for celebration',
  'dry rosé for summer',
]

interface SearchBarProps {
  onSearch: (query: string) => void
  isProcessing: boolean
  placeholder?: string
  size?: 'default' | 'lg'
}

export function SearchBar({ onSearch, isProcessing, placeholder = 'Try "light red for dinner" or "wine similar to Rioja"...', size = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isProcessing) return
    setShowSuggestions(false)
    onSearch(query.trim())
  }

  const handleSuggestion = (s: string) => {
    setQuery(s)
    setShowSuggestions(false)
    onSearch(s)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={cn(
          'flex items-center gap-2 rounded-xl border bg-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/30',
          size === 'lg' ? 'px-4 py-3' : 'px-3 py-2'
        )}>
          {/* AI pulse indicator */}
          <div className="relative shrink-0">
            {isProcessing ? (
              <Loader2 className={cn('text-primary animate-spin', size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
            ) : (
              <div className="relative">
                <Search className={cn('text-muted-foreground', size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={placeholder}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60',
              size === 'lg' ? 'text-base' : 'text-sm'
            )}
            disabled={isProcessing}
          />

          <Button
            type="submit"
            size={size === 'lg' ? 'default' : 'sm'}
            disabled={!query.trim() || isProcessing}
            className="shrink-0"
          >
            {isProcessing ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && !query && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
          <p className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Try asking...
          </p>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onMouseDown={() => handleSuggestion(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
