import { z } from 'zod'

// Coerce numbers from strings (Llama sometimes returns "7" instead of 7)
const FlexNumber = z.union([z.number(), z.string().transform(Number)]).pipe(z.number())

export const FlavorProfileSchema = z.object({
  acidity:  FlexNumber.optional().default(5),
  tannin:   FlexNumber.optional().default(5),
  body:     FlexNumber.optional().default(5),
  sweetness: FlexNumber.optional().default(5),
  alcohol:  FlexNumber.optional().default(5),
})

// Normalize style — Llama may return "Red", "rose", etc.
const normalizeStyle = (s: string) =>
  s.toLowerCase().replace('rose', 'rosé').replace('rosy', 'rosé').split(' ')[0]

export const WineStyleSchema = z.string().transform(normalizeStyle).pipe(
  z.enum(['red', 'white', 'rosé', 'sparkling', 'dessert']).catch('red')
)

// Normalize price range — Llama may use "affordable", "moderate", etc.
const normalizePriceRange = (s: string): 'budget' | 'mid' | 'premium' | 'luxury' => {
  const lower = s.toLowerCase()
  if (lower.includes('budget') || lower.includes('afford') || lower.includes('cheap')) return 'budget'
  if (lower.includes('luxury') || lower.includes('expens') || lower.includes('high')) return 'luxury'
  if (lower.includes('premium') || lower.includes('upper')) return 'premium'
  return 'mid'
}

export const PriceRangeSchema = z.string().transform(normalizePriceRange).catch('mid')

export const WinePartialSchema = z.object({
  name:             z.string().min(1),
  producer:         z.string().optional(),
  vintage:          z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(1800).max(2030)).nullable().optional(),
  region:           z.string().optional(),
  country:          z.string().optional(),
  variety:          z.array(z.string()).optional().default([]),
  style:            WineStyleSchema,
  description:      z.string().optional(),
  flavor_profile:   FlavorProfileSchema.optional(),
  food_pairings:    z.array(z.string()).optional().default([]),
  price_range:      PriceRangeSchema.optional(),
  why_recommended:  z.string().optional(),
})

export const WineSearchResponseSchema = z.object({
  wines:               z.array(WinePartialSchema).min(1).max(12),
  query_interpretation: z.string().optional().default(''),
  total_results:       z.union([z.number(), z.string().transform(Number)]).pipe(z.number()).optional(),
})

export const SearchRequestSchema = z.object({
  query: z.string().min(2).max(500),
})
