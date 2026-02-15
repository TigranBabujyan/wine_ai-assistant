import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Wine } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Wine className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        This page doesn&apos;t exist. Perhaps try searching for a wine instead?
      </p>
      <div className="flex gap-3">
        <Link href="/"><Button variant="outline">Go Home</Button></Link>
        <Link href="/search"><Button>Search Wines</Button></Link>
      </div>
    </div>
  )
}
