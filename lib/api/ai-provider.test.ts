import { describe, it, expect } from 'vitest'
import { buildDoneEvent } from './ai-provider'

describe('buildDoneEvent', () => {
  it('returns error event for empty response', () => {
    const result = buildDoneEvent('')
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.error).toBeDefined()
    expect(parsed.done).toBeUndefined()
  })

  it('returns error event for whitespace-only response', () => {
    const result = buildDoneEvent('   \n  ')
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.error).toBeDefined()
  })

  it('returns error event for malformed JSON', () => {
    const result = buildDoneEvent('this is not json at all { broken')
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.error).toBeDefined()
    expect(parsed.done).toBeUndefined()
  })

  it('returns error event when schema validation fails', () => {
    // Valid JSON but wrong shape — missing required wines array
    const result = buildDoneEvent(JSON.stringify({ message: 'hello' }))
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.error).toBeDefined()
  })

  it('returns error event when wines array is empty', () => {
    const result = buildDoneEvent(JSON.stringify({ wines: [] }))
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.error).toBeDefined()
  })

  it('returns done event with valid wine search response', () => {
    const validResponse = {
      wines: [
        {
          name: 'Malbec Reserva',
          style: 'red',
          region: 'Mendoza',
          country: 'Argentina',
          variety: ['Malbec'],
          food_pairings: ['steak'],
          price_range: 'mid',
        },
      ],
      query_interpretation: 'Bold red wine for steak',
    }
    const result = buildDoneEvent(JSON.stringify(validResponse))
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.done).toBe(true)
    expect(parsed.result).toBeDefined()
    expect(parsed.result.wines).toHaveLength(1)
    expect(parsed.error).toBeUndefined()
  })

  it('returns done event when AI wraps JSON in markdown code block', () => {
    const validResponse = {
      wines: [
        { name: 'Chianti', style: 'red', variety: [], food_pairings: [] },
      ],
    }
    const withMarkdown = `\`\`\`json\n${JSON.stringify(validResponse)}\n\`\`\``
    const result = buildDoneEvent(withMarkdown)
    const parsed = JSON.parse(result.replace('data: ', '').trim())
    expect(parsed.done).toBe(true)
  })
})
