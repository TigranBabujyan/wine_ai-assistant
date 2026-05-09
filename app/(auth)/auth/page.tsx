'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/api/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.get('email') as string,
      password: form.get('password') as string,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string

    // Check if email is already registered before calling signUp
    // (Supabase silently succeeds on duplicate emails when confirmation is on)
    const check = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const { exists } = await check.json()
    if (exists) {
      setError('An account with this email already exists. Please sign in instead.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password: form.get('password') as string,
      options: {
        data: { name: form.get('name') as string },
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMessage('Check your email to confirm your account, then sign in.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo — mobile only (desktop shows in layout panel) */}
      <Link href="/" className="flex items-center gap-2.5 justify-center lg:hidden">
        <Image src="/logo.svg" alt="Wine AI" width={36} height={36} className="rounded-full" />
        <span className="font-bold text-xl">Wine AI</span>
      </Link>

      <div>
        <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your account or create a new one.</p>
      </div>

        {/* Card */}
        <div className="bg-card border rounded-2xl shadow-sm p-6">
          <Tabs defaultValue="signin">
            <TabsList className="w-full mb-5">
              <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Create Account</TabsTrigger>
            </TabsList>

            {/* Sign In */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" placeholder="••••••••" required />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" name="name" type="text" placeholder="Your name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" placeholder="8+ characters" minLength={8} required />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />{error}
                  </div>
                )}
                {message && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                    {message}
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our terms. Your data is stored securely.
      </p>
    </div>
  )
}
