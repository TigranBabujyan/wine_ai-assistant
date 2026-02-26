'use client'

import { useState, useEffect, useCallback } from 'react'
import { WineFull, WinePartial } from '@/types/wine.types'
import { ACHIEVEMENT_DEFINITIONS } from '@/types/achievement.types'
import { toast } from 'sonner'

export function useJournal() {
  const [wines, setWines] = useState<WineFull[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWines = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/wines')
    const data = await res.json()
    setWines(data.wines ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchWines() }, [fetchWines])

  const saveWine = useCallback(async (wine: WinePartial) => {
    const res = await fetch('/api/wines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...wine, source: wine.source ?? 'search' }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to save wine')
      return null
    }

    setWines(prev => [data.wine, ...prev])

    // Notify about new achievements
    if (data.new_achievements?.length > 0) {
      for (const type of data.new_achievements) {
        const def = ACHIEVEMENT_DEFINITIONS[type as keyof typeof ACHIEVEMENT_DEFINITIONS]
        if (def) {
          toast.success(`${def.icon} Achievement unlocked: ${def.name}`)
        }
      }
    }

    return data.wine as WineFull
  }, [])

  const deleteWine = useCallback(async (id: string) => {
    const res = await fetch(`/api/wines/${id}`, { method: 'DELETE' })
    if (res.ok) setWines(prev => prev.filter(w => w.id !== id))
  }, [])

  return { wines, loading, saveWine, deleteWine, refetch: fetchWines }
}
