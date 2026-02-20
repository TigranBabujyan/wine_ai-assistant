'use client'

import { useCallback, useState } from 'react'
import { useWineStore } from '@/store/wine.store'
import { WineSearchResponse } from '@/types/wine.types'

export function useWineSearch() {
  const { searchResults, searchQuery, searchLoading, searchError,
    setSearchResults, setSearchLoading, setSearchError } = useWineStore()

  // Streaming token buffer shown while Claude is thinking
  const [streamBuffer, setStreamBuffer] = useState('')

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return
    setSearchLoading(true)
    setStreamBuffer('')

    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) {
        const data = await res.json()
        setSearchError(data.error ?? 'Search failed')
        return
      }

      // Read the SSE stream
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) { setSearchError('Stream unavailable'); return }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''  // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue

          try {
            const msg = JSON.parse(raw) as {
              chunk?: string
              done?: boolean
              result?: WineSearchResponse
              error?: string
            }

            if (msg.chunk) {
              // Accumulate streaming tokens for display
              setStreamBuffer(prev => prev + msg.chunk)
            }

            if (msg.error) {
              setSearchError(msg.error)
              return
            }

            if (msg.done && msg.result) {
              setSearchResults(msg.result.wines, query)
              setStreamBuffer('')
            }
          } catch {
            // malformed SSE line — skip
          }
        }
      }
    } catch {
      setSearchError('Network error. Please try again.')
    } finally {
      setSearchLoading(false)
      setStreamBuffer('')
    }
  }, [setSearchLoading, setSearchResults, setSearchError])

  return { search, searchResults, searchQuery, searchLoading, searchError, streamBuffer }
}
