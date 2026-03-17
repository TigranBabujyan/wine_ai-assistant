import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/api/supabase-server'
import { testApiKey } from '@/lib/api/ai-provider'
import { AIProvider, PROVIDER_CONFIGS } from '@/types/ai.types'
import { z } from 'zod'

const SaveKeySchema = z.object({
  key: z.string().min(20, 'Key too short'),
  provider: z.enum(['anthropic', 'openai', 'groq']),
  model_pref: z.enum(['fast', 'quality']).default('fast'),
})

const DeleteKeySchema = z.object({
  provider: z.enum(['anthropic', 'openai', 'groq']),
})

const SelectProviderSchema = z.object({
  provider: z.enum(['anthropic', 'openai', 'groq']),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()

    // Handle provider selection (no key needed)
    if (body.action === 'select_provider') {
      const parsed = SelectProviderSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
      await supabase.rpc('set_selected_provider', {
        p_user_id: user.id,
        p_provider: parsed.data.provider,
      })
      return NextResponse.json({ success: true })
    }

    // Handle key save
    const parsed = SaveKeySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      )
    }

    const { key, provider, model_pref } = parsed.data

    // Validate key prefix matches provider
    const config = PROVIDER_CONFIGS[provider as AIProvider]
    if (!key.startsWith(config.keyPrefix)) {
      return NextResponse.json(
        { error: `${config.label} keys must start with "${config.keyPrefix}"` },
        { status: 400 }
      )
    }

    // Test the key with a real API call
    try {
      await testApiKey(provider as AIProvider, key)
    } catch (testErr) {
      const msg = testErr instanceof Error ? testErr.message : String(testErr)
      console.error('API key test failed:', msg)
      return NextResponse.json(
        { error: `API key test failed: ${msg}` },
        { status: 422 }
      )
    }

    const hint = key.slice(-4)

    const { error } = await supabase.rpc('save_api_key', {
      p_user_id:    user.id,
      p_key:        key,
      p_hint:       hint,
      p_model_pref: model_pref,
      p_provider:   provider,
      p_secret:     process.env.DB_ENCRYPTION_SECRET ?? '',
    })

    if (error) {
      console.error('Save API key error:', error)
      return NextResponse.json({ error: `Failed to save key: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, hint, provider })
  } catch (error) {
    console.error('API key route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({ provider: 'anthropic' }))
    const parsed = DeleteKeySchema.safeParse(body)
    const provider = parsed.success ? parsed.data.provider : 'anthropic'

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider)

    if (error) return NextResponse.json({ error: 'Failed to revoke key' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API key delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
