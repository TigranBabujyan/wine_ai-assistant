import { createClient } from '@/lib/api/supabase-server'
import { TastingProfile } from '@/components/features/wine/TastingProfile'
import { NoteEditor } from '@/components/features/journal/NoteEditor'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'
import { MapPin, Calendar, Wine, UtensilsCrossed } from 'lucide-react'

export default async function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: wine } = await supabase
    .from('wines')
    .select('*, notes(*)')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!wine) notFound()

  const notes = wine.notes ?? []

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {wine.style && (
            <Badge variant="secondary" className="capitalize">{wine.style}</Badge>
          )}
          {wine.variety?.map((v: string) => (
            <Badge key={v} variant="outline">{v}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-1">{wine.name}</h1>
        {wine.producer && <p className="text-lg text-muted-foreground">{wine.producer}</p>}

        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
          {(wine.region || wine.country) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {[wine.region, wine.country].filter(Boolean).join(', ')}
            </span>
          )}
          {wine.vintage && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {wine.vintage}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: description + pairings */}
        <div className="space-y-5">
          {wine.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wine className="w-4 h-4" /> About this Wine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{wine.description}</p>
                {wine.ai_summary && wine.ai_summary !== wine.description && (
                  <p className="text-xs text-muted-foreground mt-3 italic">{wine.ai_summary}</p>
                )}
              </CardContent>
            </Card>
          )}

          {wine.tasting_notes && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tasting Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {wine.tasting_notes.aroma?.length > 0 && (
                  <div>
                    <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">Aroma</p>
                    <p>{wine.tasting_notes.aroma.join(', ')}</p>
                  </div>
                )}
                {wine.tasting_notes.palate?.length > 0 && (
                  <div>
                    <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">Palate</p>
                    <p>{wine.tasting_notes.palate.join(', ')}</p>
                  </div>
                )}
                {wine.tasting_notes.finish && (
                  <div>
                    <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">Finish</p>
                    <p>{wine.tasting_notes.finish}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {wine.flavor_profile && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> Food Pairings
              </h3>
              {Array.isArray(wine.food_pairings) && (
                <div className="flex flex-wrap gap-2">
                  {wine.food_pairings.map((p: string) => (
                    <Badge key={p} variant="secondary">{p}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: flavor profile radar */}
        {wine.flavor_profile && (
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Flavor Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <TastingProfile profile={wine.flavor_profile} wineStyle={wine.style ?? 'red'} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tasting notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add note */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Add a Note</CardTitle>
          </CardHeader>
          <CardContent>
            <NoteEditor wineId={wine.id} />
          </CardContent>
        </Card>

        {/* Existing notes */}
        {notes.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Your Notes</h3>
            {(notes as Array<{ id: string; content: string; rating?: number; occasion?: string; created_at: string }>).map((note) => (
              <Card key={note.id} className="bg-muted/30">
                <CardContent className="p-4">
                  {note.rating ? (
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < note.rating! ? 'text-accent' : 'text-muted-foreground/30'}>★</span>
                      ))}
                    </div>
                  ) : null}
                  <p className="text-sm">{note.content}</p>
                  {note.occasion ? <p className="text-xs text-muted-foreground mt-2">{note.occasion}</p> : null}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
