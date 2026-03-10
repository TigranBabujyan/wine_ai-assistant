import { createClient } from '@/lib/api/supabase-server'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [winesRes, scansRes, achievementsRes, keyRes] = await Promise.all([
    supabase.from('wines').select('*').eq('user_id', user!.id).order('saved_at', { ascending: false }).limit(6),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('achievements').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
    supabase.from('api_keys').select('provider').eq('user_id', user!.id).eq('is_active', true),
  ])

  const hasApiKey = (keyRes.data ?? []).length > 0
  const recentWines = winesRes.data ?? []
  const firstName = user?.user_metadata?.name?.split(' ')[0] ?? 'there'

  const stats = [
    { label: 'Wines Saved',    value: recentWines.length,         color: 'wine'    as const, href: '/journal' },
    { label: 'Labels Scanned', value: scansRes.count ?? 0,        color: 'gold'    as const, href: '/scan' },
    { label: 'Achievements',   value: achievementsRes.count ?? 0, color: 'emerald' as const, href: '/achievements' },
  ]

  return (
    <DashboardClient
      firstName={firstName}
      stats={stats}
      recentWines={recentWines}
      hasApiKey={hasApiKey}
    />
  )
}
