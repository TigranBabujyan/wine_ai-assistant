import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/api/supabase-server'
import { scanLabel } from '@/lib/api/ai-provider'
import { parseClaudeJson } from '@/lib/api/claude'
import { ScanRequestSchema, ScanResponseSchema } from '@/lib/validations/scan.schema'
import { checkRateLimit } from '@/lib/utils/rate-limit'
import { AIProvider } from '@/types/ai.types'

const MAX_BASE64_LENGTH = 7 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { allowed } = checkRateLimit(`scan:${user.id}`)
    if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const body = await req.json()
    const parsed = ScanRequestSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    if (parsed.data.image.length > MAX_BASE64_LENGTH) {
      return NextResponse.json({ error: 'Image too large. Please use an image under 5MB.' }, { status: 413 })
    }

    // Get selected provider
    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('selected_provider')
      .eq('user_id', user.id)
      .single()

    const provider: AIProvider = (prefs?.selected_provider as AIProvider) ?? 'anthropic'

    const { data: keyRecord } = await supabase
      .from('api_keys')
      .select('key_encrypted')
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

    const { text, tokensUsed, model } = await scanLabel(
      provider,
      apiKey,
      parsed.data.image,
      parsed.data.mimeType
    )

    const scanData = ScanResponseSchema.safeParse(parseClaudeJson(text))
    if (!scanData.success) {
      console.error('Scan validation failed:', scanData.error)
      return NextResponse.json({ error: 'AI returned unexpected format' }, { status: 502 })
    }

    const { data: scan } = await supabase.from('scans').insert({
      user_id: user.id,
      image_url: 'pending',
      extracted_data: scanData.data,
      confidence: scanData.data.confidence,
      model_used: model,
      tokens_used: tokensUsed,
    }).select().single()

    return NextResponse.json({
      wine: { ...scanData.data, source: 'scan' },
      scan_id: scan?.id,
      confidence: scanData.data.confidence,
      notes: scanData.data.notes,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Scan route error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
