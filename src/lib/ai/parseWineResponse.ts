import { z } from "zod";
import { WineSchema } from "../validations/wine";

export const WineAiResponseSchema = z.object({
  wines: z.array(WineSchema).min(1),
});

export type WineAiResponse = z.infer<typeof WineAiResponseSchema>;

export function parseWineResponse(input: unknown): WineAiResponse {
  return WineAiResponseSchema.parse(input);
}

export function safeParseWineResponse(input: unknown) {
  return WineAiResponseSchema.safeParse(input);
}
