'use client'

import { AchievementDefinition } from '@/types/achievement.types'

interface AchievementBadgeProps {
  definition: AchievementDefinition
  unlocked: boolean
  unlockedAt?: string
}

export function AchievementBadge({ definition, unlocked, unlockedAt }: AchievementBadgeProps) {
  return (
    <div
      className="relative flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300"
      style={unlocked ? {
        background: 'rgba(139,34,82,0.12)',
        border: '1px solid rgba(139,34,82,0.25)',
        boxShadow: '0 0 30px rgba(139,34,82,0.08)',
      } : {
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        opacity: 0.5,
        filter: 'grayscale(0.6)',
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
        style={unlocked ? {
          background: 'rgba(139,34,82,0.2)',
          boxShadow: '0 0 20px rgba(139,34,82,0.2)',
        } : {
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        {definition.icon}
      </div>

      {/* Name */}
      <h3
        className="font-medium text-sm mb-1"
        style={{ color: unlocked ? '#F5F0E8' : 'rgba(255,255,255,0.4)', fontFamily: 'Playfair Display, serif' }}
      >
        {definition.name}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {definition.description}
      </p>

      {/* Unlock date */}
      {unlocked && unlockedAt && (
        <p className="text-xs font-medium mt-2" style={{ color: '#C9A84C' }}>
          {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      {/* Lock requirement */}
      {!unlocked && (
        <p className="text-xs mt-2 italic" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {definition.requirement}
        </p>
      )}
    </div>
  )
}
