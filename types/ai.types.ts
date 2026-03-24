export type AIProvider = 'anthropic' | 'openai' | 'groq'

// Generic speed/quality preference — maps to provider-specific models
export type ModelPref = 'fast' | 'quality'

export interface ProviderConfig {
  name: string
  label: string
  keyPrefix: string
  keyPlaceholder: string
  docsUrl: string
  models: {
    fast: string
    quality: string
    vision: string   // model used for label scanning
  }
}

export const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  groq: {
    name: 'groq',
    label: 'Groq (Free)',
    keyPrefix: 'gsk_',
    keyPlaceholder: 'gsk_...',
    docsUrl: 'https://console.groq.com/keys',
    models: {
      fast: 'llama-3.1-8b-instant',
      quality: 'llama-3.3-70b-versatile',
      vision: 'meta-llama/llama-4-scout-17b-16e-instruct',
    },
  },
  anthropic: {
    name: 'anthropic',
    label: 'Anthropic Claude',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-api03-...',
    docsUrl: 'https://console.anthropic.com',
    models: {
      fast: 'claude-haiku-4-5-20251001',
      quality: 'claude-sonnet-4-6',
      vision: 'claude-sonnet-4-6',
    },
  },
  openai: {
    name: 'openai',
    label: 'OpenAI GPT-4o',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-proj-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    models: {
      fast: 'gpt-4o-mini',
      quality: 'gpt-4o',
      vision: 'gpt-4o',
    },
  },
}

export interface ApiKeyRecord {
  id: string
  user_id: string
  provider: AIProvider
  key_hint: string
  model_pref: ModelPref
  is_active: boolean
  created_at: string
}

export interface UserPreferences {
  user_id: string
  selected_provider: AIProvider
}
