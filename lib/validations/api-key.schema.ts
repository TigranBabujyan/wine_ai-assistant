import { z } from 'zod'

export const ApiKeyRequestSchema = z.object({
  key: z
    .string()
    .min(20, 'Key too short')
    .regex(/^sk-ant-/, 'Must be an Anthropic API key starting with sk-ant-'),
  model_pref: z.enum(['haiku', 'sonnet']).default('haiku'),
})

export const NoteRequestSchema = z.object({
  wine_id: z.string().uuid(),
  content: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  occasion: z.string().max(100).optional(),
  paired_with: z.array(z.string()).optional(),
  drunk_at: z.string().optional(),
})
