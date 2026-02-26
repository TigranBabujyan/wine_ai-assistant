import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/api/supabase-server'
import { checkAndUnlockAchievements } from '@/lib/utils/achievement-engine'
import { z } from 'zod'

const SaveWineSchema = z.object({
  name: z.string().min(1),
  producer: z.string().optional(),
  vintage: z.number().optional().nullable(),
  region: z.string().optional(),
  country: z.string().optional(),
  variety: z.array(z.string()).optional(),
  style: z.enum(['red', 'white', 'rosé', 'sparkling', 'dessert']),
  description: z.string().optional(),
  tasting_notes: z.any().optional(),
  flavor_profile: z.any().optional(),
  ai_summary: z.string().optional(),
  label_image_url: z.string().optional(),
  source: z.enum(['search', 'scan', 'manual']),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('wines')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ wines: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = SaveWineSchema.safeParse(body)
    if (!parsed.success) {
      console.error('SaveWineSchema failed:', parsed.error.issues)
      return NextResponse.json({ error: 'Invalid wine data' }, { status: 400 })
    }

    // Duplicate check — same name already in journal
    const { data: existing } = await supabase
      .from('wines')
      .select('id')
      .eq('user_id', user.id)
      .ilike('name', parsed.data.name)
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This wine is already in your journal' }, { status: 409 })
    }

    const { data: wine, error } = await supabase
      .from('wines')
      .insert({ ...parsed.data, user_id: user.id })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Check achievements asynchronously (don't block response)
    const newAchievements = await checkAndUnlockAchievements(user.id)

    return NextResponse.json({ wine, new_achievements: newAchievements })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
