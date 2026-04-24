import { z } from "zod";

export const FlavorProfileSchema = z.object({
  acidity: z.number().min(0).max(10),
  tannin: z.number().min(0).max(10),
  body: z.number().min(0).max(10),
  sweetness: z.number().min(0).max(10),
  alcohol: z.number().min(0).max(10),
});

export const WineSchema = z.object({
  name: z.string().min(1),
  region: z.string().min(1),
  vintage: z.string().optional(),
  description: z.string().min(1),
  flavorProfile: FlavorProfileSchema,
});

export type Wine = z.infer<typeof WineSchema>;
