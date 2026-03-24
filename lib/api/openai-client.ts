import OpenAI from 'openai'

export function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey })
}

export function createGroqClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' })
}

// OpenAI/Groq vision scan — builds the message content with base64 image
// detail: 'high' is OpenAI-only; Groq ignores or rejects it so we omit it
export function buildOpenAIVisionContent(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  useDetail = false
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const imageUrl: { url: string; detail?: 'high' | 'low' | 'auto' } = {
    url: `data:${mimeType};base64,${base64Image}`,
  }
  if (useDetail) imageUrl.detail = 'high'

  return [
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: imageUrl },
        { type: 'text', text: systemPrompt },
      ],
    },
  ]
}
