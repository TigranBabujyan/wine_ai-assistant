'use client'

import { useState, useEffect } from 'react'
import { ApiKeyManager } from '@/components/features/settings/ApiKeyManager'
import { Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AIProvider, ApiKeyRecord } from '@/types/ai.types'
import { createClient } from '@/lib/api/supabase'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [keys, setKeys] = useState<Partial<Record<AIProvider, ApiKeyRecord>>>({})
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('anthropic')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (!user) { setLoading(false); return }

    const [keysRes, prefsRes] = await Promise.all([
      supabase
        .from('api_keys')
        .select('id, key_hint, model_pref, is_active, created_at, user_id, provider')
        .eq('user_id', user.id),
      supabase
        .from('user_preferences')
        .select('selected_provider')
        .eq('user_id', user.id)
        .single(),
    ])

    const keyMap: Partial<Record<AIProvider, ApiKeyRecord>> = {}
    for (const k of keysRes.data ?? []) {
      keyMap[k.provider as AIProvider] = k as ApiKeyRecord
    }
    setKeys(keyMap)
    setSelectedProvider((prefsRes.data?.selected_provider as AIProvider) ?? 'anthropic')
    setLoading(false)
  }

  useEffect(() => { fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return null

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your AI providers and account.</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="font-medium">{user?.email}</p>
        </CardContent>
      </Card>

      {/* AI Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Providers</CardTitle>
          <CardDescription>
            Connect your own API keys. Keys are encrypted at rest and never exposed in responses.
            You can add multiple providers and switch between them anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyManager
            keys={keys}
            selectedProvider={selectedProvider}
            onSaved={fetchData}
          />
        </CardContent>
      </Card>
    </div>
  )
}
