'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ACHIEVEMENT_DEFINITIONS } from '@/types/achievement.types'

interface NoteEditorProps {
  wineId: string
  onSaved?: () => void
}

export function NoteEditor({ wineId, onSaved }: NoteEditorProps) {
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [occasion, setOccasion] = useState('')
  const [drunkAt, setDrunkAt] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wine_id: wineId,
          content: content.trim(),
          rating: rating || undefined,
          occasion: occasion || undefined,
          drunk_at: drunkAt || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to save note')
        return
      }

      if (data.new_achievements?.length > 0) {
        for (const type of data.new_achievements) {
          const def = ACHIEVEMENT_DEFINITIONS[type as keyof typeof ACHIEVEMENT_DEFINITIONS]
          if (def) toast.success(`${def.icon} Achievement unlocked: ${def.name}`)
        }
      }

      toast.success('Note saved!')
      setContent('')
      setRating(0)
      setOccasion('')
      setDrunkAt('')
      onSaved?.()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Rating */}
      <div>
        <Label className="mb-2 block">Your Rating</Label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(rating === i + 1 ? 0 : i + 1)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  'w-6 h-6 transition-colors',
                  i < (hoverRating || rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground/40'
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-sm text-muted-foreground ml-2 self-center">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Outstanding'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Note content */}
      <div>
        <Label htmlFor="note-content" className="mb-2 block">Tasting Notes</Label>
        <Textarea
          id="note-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Describe what you tasted, smelled, and how it paired with food..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Occasion + date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="occasion" className="mb-2 block text-sm">Occasion</Label>
          <input
            id="occasion"
            type="text"
            value={occasion}
            onChange={e => setOccasion(e.target.value)}
            placeholder="Dinner, birthday..."
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div>
          <Label htmlFor="drunk-at" className="mb-2 block text-sm">Date Tasted</Label>
          <input
            id="drunk-at"
            type="date"
            value={drunkAt}
            onChange={e => setDrunkAt(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={!content.trim() || saving} className="w-full">
        {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Note'}
      </Button>
    </div>
  )
}
