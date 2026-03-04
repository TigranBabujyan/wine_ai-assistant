import { LabelScanner } from '@/components/features/scan/LabelScanner'
import { Camera, Zap, BookOpen } from 'lucide-react'

export default function ScanPage() {
  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Camera className="w-6 h-6 text-primary" />
          Scan Wine Label
        </h1>
        <p className="text-muted-foreground mt-1">
          Point your camera at a wine label and our AI will extract all the details.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { icon: Camera, step: '1', label: 'Upload or capture a label photo' },
          { icon: Zap, step: '2', label: 'Claude AI analyzes the image' },
          { icon: BookOpen, step: '3', label: 'Save to your journal instantly' },
        ].map(({ icon: Icon, step, label }) => (
          <div key={step} className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Scanner */}
      <LabelScanner />
    </div>
  )
}
