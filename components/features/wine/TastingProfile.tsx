'use client'

import { FlavorProfile, WineStyle } from '@/types/wine.types'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts'

interface TastingProfileProps {
  profile: FlavorProfile
  wineStyle?: WineStyle
  animated?: boolean
  size?: number
}

const STYLE_COLORS: Record<WineStyle, string> = {
  red: '#722F37',
  white: '#C9A96E',
  'rosé': '#e8849a',
  sparkling: '#93c5fd',
  dessert: '#fbbf24',
}

export function TastingProfile({ profile, wineStyle = 'red', animated = true, size = 260 }: TastingProfileProps) {
  const color = STYLE_COLORS[wineStyle]

  const data = [
    { axis: 'Acidity', value: profile.acidity },
    { axis: 'Tannin', value: profile.tannin },
    { axis: 'Body', value: profile.body },
    { axis: 'Sweetness', value: profile.sweetness },
    { axis: 'Alcohol', value: profile.alcohol },
  ]

  return (
    <div style={{ width: size, height: size }} className="mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 500 }}
          />
          <Radar
            name="Profile"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.25}
            strokeWidth={2}
            isAnimationActive={animated}
            animationBegin={0}
            animationDuration={600}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
