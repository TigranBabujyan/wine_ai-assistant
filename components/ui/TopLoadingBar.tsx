'use client'

import { useWineStore } from '@/store/wine.store'
import { useScanStore } from '@/store/scan.store'

export function TopLoadingBar() {
  const searchLoading = useWineStore(s => s.searchLoading)
  const scanState = useScanStore(s => s.state)
  const isLoading = searchLoading || scanState === 'scanning'

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden">
      <div
        className="h-full animate-progress-bar"
        style={{ background: 'linear-gradient(to right, #8B2252, #C9A84C, #8B2252)' }}
      />
    </div>
  )
}
