'use client'

interface StreamingThoughtProps {
  text: string
  visible: boolean
}

export function StreamingThought({ visible }: StreamingThoughtProps) {
  if (!visible) return null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Animated header */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Wine glass pulse animation */}
        <div className="relative flex items-center justify-center w-6 h-6">
          <div
            className="absolute w-6 h-6 rounded-full animate-ping"
            style={{ background: 'rgba(139,34,82,0.3)', animationDuration: '1.5s' }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: 'var(--wine-400)' }}
          />
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1.5 items-end h-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-1 rounded-full animate-bounce"
              style={{
                background: i % 2 === 0 ? 'var(--wine-400)' : '#C9A84C',
                height: `${8 + (i % 3) * 4}px`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>

        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Your sommelier is thinking...
        </span>
      </div>

    </div>
  )
}
