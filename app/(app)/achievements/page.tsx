import { createClient } from '@/lib/api/supabase-server'
import { AchievementBadge } from '@/components/features/achievements/AchievementBadge'
import { ACHIEVEMENT_DEFINITIONS, AchievementType } from '@/types/achievement.types'
import { Trophy } from 'lucide-react'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: unlocked } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', user!.id)

  const unlockedMap = new Map(
    (unlocked ?? []).map(a => [a.type as AchievementType, a.unlocked_at as string])
  )

  const allTypes = Object.keys(ACHIEVEMENT_DEFINITIONS) as AchievementType[]
  const unlockedCount = unlockedMap.size
  const pct = Math.round((unlockedCount / allTypes.length) * 100)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium text-gradient mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Achievements
          </h1>
          <div className="h-px w-24" style={{ background: 'linear-gradient(to right, var(--wine-500), transparent)' }} />
        </div>
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5" style={{ color: '#C9A84C' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--wine-400)' }}>
            {unlockedCount} of {allTypes.length} unlocked
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Collection progress</span>
          <span className="font-medium tabular-nums" style={{ color: '#C9A84C' }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(to right, #8B2252, #C9A84C)',
            }}
          />
        </div>
        {unlockedCount === 0 && (
          <p className="text-xs text-white/30">Save your first wine to start earning achievements.</p>
        )}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allTypes.map(type => (
          <AchievementBadge
            key={type}
            definition={ACHIEVEMENT_DEFINITIONS[type]}
            unlocked={unlockedMap.has(type)}
            unlockedAt={unlockedMap.get(type)}
          />
        ))}
      </div>
    </div>
  )
}
