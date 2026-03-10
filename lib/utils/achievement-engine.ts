import { AchievementType } from '@/types/achievement.types'
import { createClient } from '@/lib/api/supabase-server'

interface UserStats {
  total_wines: number
  total_scans: number
  total_notes: number
  rated_wines: number
  unique_regions: number
}

export async function checkAndUnlockAchievements(userId: string): Promise<AchievementType[]> {
  const supabase = await createClient()

  // Get user stats in parallel
  const [winesRes, scansRes, notesRes, ratedRes, regionsRes, existingRes] = await Promise.all([
    supabase.from('wines').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('notes').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('notes').select('id', { count: 'exact', head: true }).eq('user_id', userId).not('rating', 'is', null),
    supabase.from('wines').select('region').eq('user_id', userId).not('region', 'is', null),
    supabase.from('achievements').select('type').eq('user_id', userId),
  ])

  const stats: UserStats = {
    total_wines: winesRes.count ?? 0,
    total_scans: scansRes.count ?? 0,
    total_notes: notesRes.count ?? 0,
    rated_wines: ratedRes.count ?? 0,
    unique_regions: new Set((regionsRes.data ?? []).map(w => w.region)).size,
  }

  const alreadyUnlocked = new Set((existingRes.data ?? []).map(a => a.type as AchievementType))

  const toUnlock: AchievementType[] = []

  const rules: Array<{ type: AchievementType; condition: boolean }> = [
    { type: 'first_save', condition: stats.total_wines >= 1 },
    { type: 'five_saved', condition: stats.total_wines >= 5 },
    { type: 'first_scan', condition: stats.total_scans >= 1 },
    { type: 'five_scans', condition: stats.total_scans >= 5 },
    { type: 'first_note', condition: stats.total_notes >= 1 },
    { type: 'ten_notes', condition: stats.total_notes >= 10 },
    { type: 'three_regions', condition: stats.unique_regions >= 3 },
    { type: 'five_rated', condition: stats.rated_wines >= 5 },
  ]

  for (const rule of rules) {
    if (rule.condition && !alreadyUnlocked.has(rule.type)) {
      toUnlock.push(rule.type)
    }
  }

  if (toUnlock.length > 0) {
    await supabase.from('achievements').insert(
      toUnlock.map(type => ({ user_id: userId, type }))
    )
  }

  return toUnlock
}
