import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button-variants'
import { Wine } from 'lucide-react'

export default function WineNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <Wine className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Wine not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        This wine doesn&apos;t exist in your journal or may have been deleted.
      </p>
      <Link href="/journal" className={buttonVariants()}>
        Back to Journal
      </Link>
    </div>
  )
}
