'use client'

import { useCallback } from 'react'
import { useScanStore } from '@/store/scan.store'
import { compressImage, fileToDataUrl } from '@/lib/utils/image-utils'

export function useLabelScan() {
  const { state, previewUrl, scanResult, error, setPreview, startScan, setScanResult, setScanError, reset } = useScanStore()

  const selectFile = useCallback(async (file: File) => {
    const url = await fileToDataUrl(file)
    setPreview(url)
  }, [setPreview])

  const scan = useCallback(async (file: File) => {
    startScan()
    try {
      const { base64, mimeType } = await compressImage(file)

      const res = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      })

      const data = await res.json()
      if (!res.ok) {
        setScanError(data.error ?? 'Scan failed')
        return
      }

      setScanResult({
        ...data.wine,
        confidence: data.confidence,
        scan_notes: data.notes,
        scan_id: data.scan_id,
      })
    } catch {
      setScanError('Network error. Please try again.')
    }
  }, [startScan, setScanResult, setScanError])

  return { state, previewUrl, scanResult, error, selectFile, scan, reset }
}
