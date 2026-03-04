'use client'

import { useRef, useCallback } from 'react'
import { useLabelScan } from '@/lib/hooks/useLabelScan'
import { Button } from '@/components/ui/button'
import { WineCard } from '@/components/features/wine/WineCard'
import { Upload, Camera, RotateCcw, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useJournal } from '@/lib/hooks/useJournal'
import { toast } from 'sonner'

export function LabelScanner() {
  const { state, previewUrl, scanResult, error, selectFile, scan, reset } = useLabelScan()
  const { saveWine } = useJournal()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<File | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    fileRef.current = file
    await selectFile(file)
  }, [selectFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }, [handleFile])

  const handleScan = useCallback(() => {
    if (fileRef.current) scan(fileRef.current)
  }, [scan])

  const handleSave = useCallback(async () => {
    if (!scanResult) return
    const saved = await saveWine({ ...scanResult, source: 'scan' })
    if (saved) {
      toast.success('Wine saved to journal!')
      reset()
    }
  }, [scanResult, saveWine, reset])

  // IDLE state
  if (state === 'idle') {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors"
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Upload a wine label</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Drag & drop or click to upload. Our AI will extract wine details instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Choose File
          </Button>
          <Button variant="outline" onClick={() => cameraInputRef.current?.click()}>
            <Camera className="w-4 h-4 mr-2" /> Take Photo
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>
    )
  }

  // PREVIEWING state
  if (state === 'previewing' && previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden bg-muted max-h-80 flex items-center justify-center">
          <img src={previewUrl} alt="Wine label preview" className="max-h-80 object-contain w-full" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" /> Change Image
          </Button>
          <Button onClick={handleScan} className="flex-1">
            <Camera className="w-4 h-4 mr-2" /> Scan Label
          </Button>
        </div>
      </div>
    )
  }

  // SCANNING state
  if (state === 'scanning') {
    return (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden bg-muted max-h-80 flex items-center justify-center">
          {previewUrl && <img src={previewUrl} alt="Scanning..." className="max-h-80 object-contain w-full opacity-60" />}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="font-medium">Analyzing label...</p>
            <p className="text-sm text-muted-foreground mt-1">Claude is reading the wine details</p>
          </div>
        </div>
      </div>
    )
  }

  // RESULT state
  if (state === 'result' && scanResult) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Label scanned successfully</span>
        </div>
        <WineCard
          wine={scanResult}
          variant="scan-result"
          confidence={scanResult.confidence}
          onSave={handleSave}
        />
        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" /> Scan Another Label
        </Button>
      </div>
    )
  }

  // ERROR state
  if (state === 'error') {
    return (
      <div className="text-center py-10 space-y-4">
        <div className={cn('w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto')}>
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <div>
          <p className="font-medium text-destructive">Scan failed</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  return null
}
