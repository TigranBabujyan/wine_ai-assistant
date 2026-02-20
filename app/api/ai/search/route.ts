import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/api/supabase-server'
import { streamWineSearch } from '@/lib/api/ai-provider'
import { SearchRequestSchema } from '@/lib/validations/wine-search.schema'
import { checkRateLimit } from '@/lib/utils/rate-limit'
import { AIProvider } from '@/types/ai.types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { allowed, remaining } = checkRateLimit(user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    const body = await req.json()
    const parsed = SearchRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
    }

    // Get user's selected provider
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('selected_provider')
      .eq('user_id', user.id)
      .single()

    const provider: AIProvider = (prefs?.selected_provider as AIProvider) ?? 'anthropic'

    // Fetch the API key for the selected provider
    const { data: keyRecord } = await supabase
      .from('api_keys')
      .select('key_encrypted, model_pref')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .eq('is_active', true)
      .single()

    if (!keyRecord) {
      const providerLabel = provider === 'openai' ? 'OpenAI' : 'Anthropic'
      return NextResponse.json(
        { error: `No ${providerLabel} API key found. Please add it in Settings.` },
        { status: 422 }
      )
    }

    const { data: apiKey } = await supabase.rpc('decrypt_api_key', {
      encrypted_key: keyRecord.key_encrypted,
      p_secret:      process.env.DB_ENCRYPTION_SECRET ?? '',
    })
    if (!apiKey) return NextResponse.json({ error: 'Failed to retrieve API key' }, { status: 500 })

    const readable = await streamWineSearch(provider, apiKey, keyRecord.model_pref, parsed.data.query)

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RateLimit-Remaining': String(remaining),
      },
    })
  } catch (error) {
    console.error('Search route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
