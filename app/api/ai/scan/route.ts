import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/api/supabase-server'
import { scanLabel } from '@/lib/api/ai-provider'
import { parseClaudeJson } from '@/lib/api/claude'
import { ScanRequestSchema, ScanResponseSchema } from '@/lib/validations/scan.schema'
import { checkRateLimit } from '@/lib/utils/rate-limit'

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

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'AI service is not configured' }, { status: 503 })
    }

    const { text, tokensUsed, model } = await scanLabel(
      'groq',
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
