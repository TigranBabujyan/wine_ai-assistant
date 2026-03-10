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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Achievements
        </h1>
        <p className="text-muted-foreground mt-1">
          {unlockedCount} of {allTypes.length} achievements unlocked
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(unlockedCount / allTypes.length) * 100}%` }}
        />
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
