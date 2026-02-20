'use client'

import { WineFull, WinePartial, WineStyle } from '@/types/wine.types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BookmarkPlus, Star, ChevronRight, Shield, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export type WineCardVariant = 'search' | 'journal' | 'compact' | 'scan-result'

interface WineCardProps {
  wine?: WinePartial | WineFull
  variant?: WineCardVariant
  onSave?: (wine: WinePartial) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
  confidence?: number   // for scan-result variant
  rating?: number       // for journal variant
  noteSnippet?: string  // for journal variant
}

const STYLE_COLORS: Record<WineStyle, string> = {
  red: 'bg-red-100 text-red-800',
  white: 'bg-yellow-100 text-yellow-800',
  'rosé': 'bg-pink-100 text-pink-800',
  sparkling: 'bg-blue-100 text-blue-800',
  dessert: 'bg-amber-100 text-amber-800',
}

export function WineCard({ wine, variant = 'search', onSave, onDelete, isLoading, confidence, rating, noteSnippet }: WineCardProps) {
  if (isLoading) return <WineCardSkeleton />

  if (!wine) return null

  const isCompact = variant === 'compact'
  const isFull = 'id' in wine

  return (
    <Card className={cn(
      'flex flex-col overflow-hidden transition-shadow hover:shadow-md',
      isCompact ? 'p-3' : ''
    )}>
      {/* Style color bar */}
      <div className={cn(
        'h-1 w-full',
        wine.style === 'red' ? 'bg-primary' :
        wine.style === 'white' ? 'bg-yellow-400' :
        wine.style === 'rosé' ? 'bg-pink-400' :
        wine.style === 'sparkling' ? 'bg-blue-400' : 'bg-amber-400'
      )} />

      <CardContent className={cn('flex-1', isCompact ? 'p-3 pt-2' : 'p-4')}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className={cn('font-semibold leading-tight truncate', isCompact ? 'text-sm' : 'text-base')}>
              {wine.name}
            </h3>
            {wine.producer && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{wine.producer}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {wine.style && (
              <Badge variant="secondary" className={cn('text-xs capitalize', STYLE_COLORS[wine.style])}>
                {wine.style}
              </Badge>
            )}
            {wine.vintage && (
              <span className="text-xs text-muted-foreground">{wine.vintage}</span>
            )}
          </div>
        </div>

        {/* Region / Country */}
        {(wine.region || wine.country) && (
          <p className="text-xs text-muted-foreground mb-2">
            {[wine.region, wine.country].filter(Boolean).join(', ')}
          </p>
        )}

        {/* Variety */}
        {wine.variety && wine.variety.length > 0 && !isCompact && (
          <div className="flex flex-wrap gap-1 mb-2">
            {wine.variety.slice(0, 3).map(v => (
              <Badge key={v} variant="outline" className="text-xs">{v}</Badge>
            ))}
          </div>
        )}

        {/* Description */}
        {wine.description && !isCompact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {wine.description}
          </p>
        )}

        {/* Note snippet for journal */}
        {noteSnippet && variant === 'journal' && (
          <p className="text-xs text-muted-foreground italic line-clamp-1 mb-2">
            &ldquo;{noteSnippet}&rdquo;
          </p>
        )}

        {/* Rating for journal */}
        {rating && variant === 'journal' && (
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn('w-3.5 h-3.5', i < rating ? 'fill-accent text-accent' : 'text-muted-foreground')}
              />
            ))}
          </div>
        )}

        {/* Confidence badge for scan */}
        {variant === 'scan-result' && confidence !== undefined && (
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className={cn('w-3.5 h-3.5', confidence >= 0.8 ? 'text-green-600' : confidence >= 0.5 ? 'text-yellow-600' : 'text-red-600')} />
            <span className="text-xs text-muted-foreground">
              {Math.round(confidence * 100)}% confidence
            </span>
          </div>
        )}

        {/* Why recommended */}
        {wine.why_recommended && variant === 'search' && !isCompact && (
          <p className="text-xs text-primary font-medium mt-1">
            {wine.why_recommended}
          </p>
        )}
      </CardContent>

      {/* Footer actions */}
      {!isCompact && (
        <CardFooter className="px-4 pb-4 pt-0 gap-2">
          {(variant === 'search' || variant === 'scan-result') && onSave && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave(wine)}
              className="flex-1 text-xs gap-1.5"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Save to Journal
            </Button>
          )}
          {variant === 'journal' && isFull && (
            <>
              <Link href={`/wine/${(wine as WineFull).id}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full text-xs gap-1.5">
                  View Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete((wine as WineFull).id)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

export function WineCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 w-full bg-muted" />
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-5 w-12 ml-2" />
        </div>
        <Skeleton className="h-3 w-1/3 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-4/5" />
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )
}
