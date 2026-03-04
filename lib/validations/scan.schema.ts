import { z } from 'zod'
import { FlavorProfileSchema, WineStyleSchema } from './wine-search.schema'

export const ScanResponseSchema = z.object({
  name: z.string().min(1),
  producer: z.string().optional(),
  vintage: z.number().int().min(1800).max(2030).nullable().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  variety: z.array(z.string()).optional(),
  style: WineStyleSchema,
  description: z.string().optional(),
  flavor_profile: FlavorProfileSchema.optional(),
  food_pairings: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1),
  notes: z.string().optional(),
})

export const ScanRequestSchema = z.object({
  image: z.string().min(1),   // base64 data
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
})
