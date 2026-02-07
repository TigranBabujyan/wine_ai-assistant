// Re-export from ai.types for backward compatibility
export type { ApiKeyRecord, ModelPref } from './ai.types'

export type ClaudeModel =
  | 'claude-haiku-4-5-20251001'
  | 'claude-sonnet-4-6'

export const CLAUDE_MODELS = {
  haiku: 'claude-haiku-4-5-20251001' as ClaudeModel,
  sonnet: 'claude-sonnet-4-6' as ClaudeModel,
}
