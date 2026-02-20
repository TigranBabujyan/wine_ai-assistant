import Anthropic from '@anthropic-ai/sdk'
import { ClaudeModel, CLAUDE_MODELS } from '@/types/claude.types'

export function createClaudeClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey })
}

// Maps any model pref string to a Claude model ID
export function getModelId(pref: string): ClaudeModel {
  if (pref === 'quality' || pref === 'sonnet') return CLAUDE_MODELS.sonnet
  return CLAUDE_MODELS.haiku
}

// Parse JSON from any LLM response — strips markdown fences and extracts the first JSON object/array
export function parseClaudeJson<T>(text: string): T {
  // Strip markdown fences
  let cleaned = text
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```\s*$/m, '')
    .trim()

  // If there's still non-JSON preamble, extract the first { ... } block
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end !== -1 && start < end) {
    cleaned = cleaned.slice(start, end + 1)
  }

  return JSON.parse(cleaned) as T
}
