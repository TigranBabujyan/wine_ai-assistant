import { create } from 'zustand'
import { WinePartial } from '@/types/wine.types'

export type ScanState = 'idle' | 'previewing' | 'scanning' | 'result' | 'error'

interface ScanStoreState {
  state: ScanState
  previewUrl: string | null
  scanResult: (WinePartial & { confidence?: number; scan_notes?: string; scan_id?: string }) | null
  error: string | null

  setPreview: (url: string) => void
  startScan: () => void
  setScanResult: (result: ScanStoreState['scanResult']) => void
  setScanError: (error: string) => void
  reset: () => void
}

export const useScanStore = create<ScanStoreState>((set) => ({
  state: 'idle',
  previewUrl: null,
  scanResult: null,
  error: null,

  setPreview: (url) => set({ state: 'previewing', previewUrl: url, error: null }),
  startScan: () => set({ state: 'scanning' }),
  setScanResult: (result) => set({ state: 'result', scanResult: result }),
  setScanError: (error) => set({ state: 'error', error }),
  reset: () => set({ state: 'idle', previewUrl: null, scanResult: null, error: null }),
}))
