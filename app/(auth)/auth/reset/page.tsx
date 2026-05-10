'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/api/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  // Supabase processes the recovery token from the URL hash automatically.
  // Wait for the PASSWORD_RECOVERY auth event before showing the form.
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm = form.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <Link href="/" className="flex items-center gap-2.5 justify-center lg:hidden">
        <Image src="/logo.svg" alt="CorkWise" width={36} height={36} className="rounded-full" />
        <span className="font-bold text-xl">CorkWise</span>
      </Link>

      <div>
        <h2 className="text-2xl font-bold mb-1">Set new password</h2>
        <p className="text-sm text-muted-foreground">Choose a strong password for your account.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm p-6">
        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
            <p className="font-medium">Password updated successfully</p>
            <p className="text-sm text-muted-foreground">Redirecting you to dashboard…</p>
          </div>
        ) : !ready ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Verifying reset link…</p>
            <p className="text-xs mt-1">
              If nothing happens, your link may have expired.{' '}
              <Link href="/auth" className="underline hover:text-foreground transition-colors">
                Request a new one
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" placeholder="8+ characters" minLength={8} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" name="confirm" type="password" placeholder="Repeat your password" minLength={8} required />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating…</> : 'Update Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
