/**
 * Unified AI provider abstraction.
 * Routes search and scan calls to either Anthropic or OpenAI
 * based on the user's selected provider.
 */

import Anthropic from '@anthropic-ai/sdk'
import { createClaudeClient, parseClaudeJson } from './claude'
import { createOpenAIClient, createGroqClient, buildOpenAIVisionContent } from './openai-client'
import { AIProvider, ModelPref, PROVIDER_CONFIGS } from '@/types/ai.types'
import { WINE_SEARCH_SYSTEM_PROMPT, buildSearchUserMessage } from '@/lib/prompts/wine-search'
import { LABEL_SCAN_SYSTEM_PROMPT } from '@/lib/prompts/label-scan'
import { WineSearchResponseSchema } from '@/lib/validations/wine-search.schema'
import { ScanResponseSchema } from '@/lib/validations/scan.schema'

function serializeSseEvent(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`
}

function toPublicAiError(error: unknown): string {
  if (error instanceof Error && error.message) {
    const message = error.message.toLowerCase()
    if (message.includes('rate limit') || message.includes('429')) return 'AI provider rate limit reached. Please try again shortly.'
    if (message.includes('unauthorized') || message.includes('invalid api key') || message.includes('401')) return 'AI provider rejected the API key. Please check Settings.'
    if (message.includes('timeout') || message.includes('network')) return 'AI provider did not respond in time. Please try again.'
  }

  return 'AI request failed. Please try again.'
}

function logAiError(context: string, error: unknown) {
  console.error(`[AI] ${context}:`, error instanceof Error ? error.message : error)
}

export function getModel(provider: AIProvider, pref: ModelPref | string): string {
  const config = PROVIDER_CONFIGS[provider]
  if (pref === 'fast' || pref === 'haiku') return config.models.fast
  if (pref === 'quality' || pref === 'sonnet') return config.models.quality
  return config.models.fast
}

export function getVisionModel(provider: AIProvider): string {
  return PROVIDER_CONFIGS[provider].models.vision
}

// ─── Streaming search ─────────────────────────────────────────────────────────

export async function streamWineSearch(
  provider: AIProvider,
  apiKey: string,
  modelPref: string,
  query: string
): Promise<ReadableStream> {
  const encoder = new TextEncoder()
  const model = getModel(provider, modelPref)

  if (provider === 'anthropic') {
    return streamAnthropicSearch(apiKey, model, query, encoder)
  } else if (provider === 'groq') {
    return streamOpenAISearch(createGroqClient(apiKey), model, query, encoder)
  } else {
    return streamOpenAISearch(createOpenAIClient(apiKey), model, query, encoder)
  }
}

async function streamAnthropicSearch(
  apiKey: string,
  model: string,
  query: string,
  encoder: TextEncoder
): Promise<ReadableStream> {
  const claude = createClaudeClient(apiKey)
  const stream = await claude.messages.create({
    model,
    max_tokens: 2048,
    system: WINE_SEARCH_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildSearchUserMessage(query) }],
    stream: true,
  })

  let fullText = ''
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text
            controller.enqueue(encoder.encode(serializeSseEvent({ chunk: event.delta.text })))
          }
          if (event.type === 'message_stop') {
            controller.enqueue(encoder.encode(buildDoneEvent(fullText)))
            controller.close()
          }
        }
      } catch (err) {
        logAiError('Anthropic search stream failed', err)
        controller.enqueue(encoder.encode(serializeSseEvent({ error: toPublicAiError(err) })))
        controller.close()
      }
    },
  })
}

async function streamOpenAISearch(
  openai: ReturnType<typeof createOpenAIClient>,
  model: string,
  query: string,
  encoder: TextEncoder
): Promise<ReadableStream> {
  const stream = await openai.chat.completions.create({
    model,
    max_tokens: 2048,
    messages: [
      { role: 'system', content: WINE_SEARCH_SYSTEM_PROMPT },
      { role: 'user', content: buildSearchUserMessage(query) },
    ],
    stream: true,
  })

  let fullText = ''
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            fullText += text
            controller.enqueue(encoder.encode(serializeSseEvent({ chunk: text })))
          }
          if (chunk.choices[0]?.finish_reason === 'stop') {
            controller.enqueue(encoder.encode(buildDoneEvent(fullText)))
            controller.close()
          }
        }
      } catch (err) {
        logAiError('OpenAI-compatible search stream failed', err)
        controller.enqueue(encoder.encode(serializeSseEvent({ error: toPublicAiError(err) })))
        controller.close()
      }
    },
  })
}

export function buildDoneEvent(fullText: string): string {
  if (!fullText.trim()) {
    return serializeSseEvent({ error: 'AI returned an empty response' })
  }

  try {
    const parsedJson = parseClaudeJson(fullText)
    const parsed = WineSearchResponseSchema.safeParse(parsedJson)
    if (parsed.success) {
      return serializeSseEvent({ done: true, result: parsed.data })
    }

    console.error('Schema validation failed:', parsed.error.issues)
    console.error('Raw AI response:', fullText.slice(0, 500))
    return serializeSseEvent({ error: 'AI returned an unexpected response format' })
  } catch (err) {
    logAiError('JSON parse failed', err)
    console.error('Raw AI response:', fullText.slice(0, 500))
    return serializeSseEvent({ error: 'Failed to parse AI response' })
  }
}

// ─── Label scan ───────────────────────────────────────────────────────────────

export async function scanLabel(
  provider: AIProvider,
  apiKey: string,
  base64Image: string,
  mimeType: string
) {
  const model = getVisionModel(provider)

  if (provider === 'anthropic') {
    return scanWithAnthropic(apiKey, model, base64Image, mimeType as Anthropic.Base64ImageSource['media_type'])
  } else if (provider === 'groq') {
    return scanWithOpenAI(createGroqClient(apiKey), model, base64Image, mimeType, false)
  } else {
    return scanWithOpenAI(createOpenAIClient(apiKey), model, base64Image, mimeType, true)
  }
}

async function scanWithAnthropic(
  apiKey: string,
  model: string,
  base64Image: string,
  mimeType: Anthropic.Base64ImageSource['media_type']
) {
  const claude = createClaudeClient(apiKey)
  const message = await claude.messages.create({
    model,
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Image } },
        { type: 'text', text: LABEL_SCAN_SYSTEM_PROMPT },
      ],
    }],
  })
  const textBlock = message.content.find(c => c.type === 'text')
  if (!textBlock || textBlock.type !== 'text') throw new Error('No response from AI')
  return { text: textBlock.text, tokensUsed: message.usage.input_tokens + message.usage.output_tokens, model }
}

async function scanWithOpenAI(
  openai: ReturnType<typeof createOpenAIClient>,
  model: string,
  base64Image: string,
  mimeType: string,
  useDetail = false
) {
  const response = await openai.chat.completions.create({
    model,
    max_tokens: 1024,
    messages: buildOpenAIVisionContent(base64Image, mimeType, LABEL_SCAN_SYSTEM_PROMPT, useDetail),
  })
  const text = response.choices[0]?.message?.content ?? ''
  if (!text) throw new Error('No response from AI')
  const tokensUsed = (response.usage?.prompt_tokens ?? 0) + (response.usage?.completion_tokens ?? 0)
  return { text, tokensUsed, model }
}

// ─── Key validation test ──────────────────────────────────────────────────────

export async function testApiKey(provider: AIProvider, apiKey: string): Promise<void> {
  if (provider === 'anthropic') {
    const claude = createClaudeClient(apiKey)
    await claude.messages.create({
      model: PROVIDER_CONFIGS.anthropic.models.fast,
      max_tokens: 5,
      messages: [{ role: 'user', content: 'Hi' }],
    })
  } else {
    const client = provider === 'groq' ? createGroqClient(apiKey) : createOpenAIClient(apiKey)
    await client.chat.completions.create({
      model: PROVIDER_CONFIGS[provider].models.fast,
      max_tokens: 5,
      messages: [{ role: 'user', content: 'Hi' }],
    })
  }
}
