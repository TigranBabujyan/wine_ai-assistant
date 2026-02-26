import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/api/supabase-server'
import { checkAndUnlockAchievements } from '@/lib/utils/achievement-engine'
import { NoteRequestSchema } from '@/lib/validations/api-key.schema'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = NoteRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid note data' }, { status: 400 })
    }

    const { data: note, error } = await supabase
      .from('notes')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const newAchievements = await checkAndUnlockAchievements(user.id)

    return NextResponse.json({ note, new_achievements: newAchievements })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
