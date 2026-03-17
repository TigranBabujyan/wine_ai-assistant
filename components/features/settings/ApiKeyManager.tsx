'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, AlertCircle, Eye, EyeOff, Loader2, Trash2, Key, Zap, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { AIProvider, ApiKeyRecord, PROVIDER_CONFIGS, ModelPref } from '@/types/ai.types'
import { cn } from '@/lib/utils'

interface ApiKeyManagerProps {
  keys: Partial<Record<AIProvider, ApiKeyRecord>>
  selectedProvider: AIProvider
  onSaved: () => void
}

const PROVIDERS: AIProvider[] = ['groq', 'anthropic', 'openai']

export function ApiKeyManager({ keys, selectedProvider: initialSelected, onSaved }: ApiKeyManagerProps) {
  const [selected, setSelected] = useState<AIProvider>(initialSelected)
  const [pendingSelect, setPendingSelect] = useState(false)

  const handleSelectProvider = async (provider: AIProvider) => {
    if (provider === selected) return
    setPendingSelect(true)
    try {
      await fetch('/api/user/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_provider', provider }),
      })
      setSelected(provider)
      toast.success(`Switched to ${PROVIDER_CONFIGS[provider].label}`)
      onSaved()
    } finally {
      setPendingSelect(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Provider selector */}
      <div>
        <Label className="mb-3 block">Active AI Provider</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROVIDERS.map(provider => {
            const config = PROVIDER_CONFIGS[provider]
            const hasKey = !!keys[provider]
            const isSelected = selected === provider
            return (
              <button
                key={provider}
                onClick={() => handleSelectProvider(provider)}
                disabled={pendingSelect || !hasKey}
                className={cn(
                  'relative flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/40',
                  !hasKey && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </span>
                )}
                <span className="font-medium text-sm">{config.label}</span>
                <span className="text-xs text-muted-foreground">
                  {hasKey ? `Connected ···${keys[provider]!.key_hint}` : 'No key added'}
                </span>
              </button>
            )
          })}
        </div>
        {selected && (
          <p className="text-xs text-muted-foreground mt-2">
            All AI search and label scanning will use {PROVIDER_CONFIGS[selected].label}.
          </p>
        )}
      </div>

      {/* Per-provider key management */}
      {PROVIDERS.map(provider => (
        <ProviderKeySection
          key={provider}
          provider={provider}
          existing={keys[provider] ?? null}
          onSaved={onSaved}
        />
      ))}
    </div>
  )
}

// ─── Per-provider section ─────────────────────────────────────────────────────

function ProviderKeySection({
  provider,
  existing,
  onSaved,
}: {
  provider: AIProvider
  existing: ApiKeyRecord | null
  onSaved: () => void
}) {
  const config = PROVIDER_CONFIGS[provider]
  const [key, setKey] = useState('')
  const [modelPref, setModelPref] = useState<ModelPref>('fast')
  const [showKey, setShowKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const handleSave = async () => {
    if (!key.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), provider, model_pref: modelPref }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Failed to save key'); return }
      toast.success(`${config.label} key saved and verified!`)
      setKey('')
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  const handleRevoke = async () => {
    if (!confirm(`Revoke your ${config.label} key?`)) return
    setRevoking(true)
    try {
      const res = await fetch('/api/user/api-key', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })
      if (res.ok) { toast.success('Key revoked'); onSaved() }
      else toast.error('Failed to revoke key')
    } finally {
      setRevoking(false)
    }
  }

  return (
    <div className="rounded-xl border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {provider === 'anthropic'
            ? <Sparkles className="w-4 h-4 text-primary" />
            : provider === 'groq'
            ? <Zap className="w-4 h-4 text-orange-500" />
            : <Zap className="w-4 h-4 text-emerald-600" />
          }
          <span className="font-medium text-sm">{config.label}</span>
        </div>
        {existing?.is_active && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-green-700">
              <CheckCircle className="w-3.5 h-3.5" />
              Connected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRevoke}
              disabled={revoking}
              className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
            >
              {revoking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        )}
        {!existing?.is_active && (
          <span className="flex items-center gap-1 text-xs text-amber-600">
            <AlertCircle className="w-3.5 h-3.5" /> Not connected
          </span>
        )}
      </div>

      {/* Current key hint */}
      {existing?.is_active && (
        <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1.5 rounded-lg">
          {config.keyPrefix}···{existing.key_hint}
        </p>
      )}

      {/* Add / replace key input */}
      <div className="space-y-2">
        <Label htmlFor={`key-${provider}`} className="text-xs flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5" />
          {existing ? 'Replace key' : 'Add key'}
        </Label>
        <div className="relative">
          <Input
            id={`key-${provider}`}
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder={config.keyPlaceholder}
            className="pr-10 font-mono text-sm h-9"
          />
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Get your key at{' '}
          <a href={config.docsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {config.docsUrl.replace('https://', '')}
          </a>
        </p>
      </div>

      {/* Model preference */}
      <div className="space-y-2">
        <Label className="text-xs">Speed vs Quality</Label>
        <Select value={modelPref} onValueChange={v => setModelPref(v as ModelPref)}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fast">
              Fast — {config.models.fast} (cheaper, great for search)
            </SelectItem>
            <SelectItem value="quality">
              Quality — {config.models.quality} (slower, better reasoning)
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The vision model ({config.models.vision}) is always used for label scanning.
        </p>
      </div>

      <Button
        onClick={handleSave}
        disabled={!key.trim() || saving}
        size="sm"
        className="w-full"
      >
        {saving
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying & Saving...</>
          : existing ? `Replace ${config.label} Key` : `Save ${config.label} Key`
        }
      </Button>
    </div>
  )
}
