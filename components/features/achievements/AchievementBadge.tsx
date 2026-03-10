'use client'

import { AchievementDefinition } from '@/types/achievement.types'
import { cn } from '@/lib/utils'

interface AchievementBadgeProps {
  definition: AchievementDefinition
  unlocked: boolean
  unlockedAt?: string
}

export function AchievementBadge({ definition, unlocked, unlockedAt }: AchievementBadgeProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center text-center p-4 rounded-xl border transition-all',
        unlocked
          ? 'bg-card border-primary/30 shadow-sm'
          : 'bg-muted/50 border-border opacity-60 grayscale'
      )}
    >
      {/* Icon */}
      <div className={cn(
        'w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 transition-all',
        unlocked ? 'bg-primary/10 ring-2 ring-primary/20' : 'bg-muted'
      )}>
        {definition.icon}
      </div>

      {/* Name */}
      <h3 className={cn('font-semibold text-sm mb-1', !unlocked && 'text-muted-foreground')}>
        {definition.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {definition.description}
      </p>

      {/* Unlock date */}
      {unlocked && unlockedAt && (
        <p className="text-xs text-primary mt-2 font-medium">
          {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      {/* Lock indicator */}
      {!unlocked && (
        <p className="text-xs text-muted-foreground mt-2 italic">{definition.requirement}</p>
      )}
    </div>
  )
}
