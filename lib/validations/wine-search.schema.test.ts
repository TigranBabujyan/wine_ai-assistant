import { describe, expect, it } from 'vitest'
import {
  PriceRangeSchema,
  SearchRequestSchema,
  WineSearchResponseSchema,
  WineStyleSchema,
} from './wine-search.schema'

describe('SearchRequestSchema', () => {
  it('accepts a normal wine search query', () => {
    const result = SearchRequestSchema.safeParse({
      query: 'bold red wine under 25 euros for steak',
    })

    expect(result.success).toBe(true)
  })

  it('rejects empty or too-short queries', () => {
    const result = SearchRequestSchema.safeParse({ query: 'a' })

    expect(result.success).toBe(false)
  })
})

describe('WineSearchResponseSchema', () => {
  it('accepts valid AI search response data', () => {
    const result = WineSearchResponseSchema.safeParse({
      query_interpretation: 'User wants an affordable bold red wine for steak.',
      total_results: '1',
      wines: [
        {
          name: 'Malbec Reserva',
          producer: 'Example Estate',
          vintage: '2020',
          region: 'Mendoza',
          country: 'Argentina',
          variety: ['Malbec'],
          style: 'Red',
          description: 'Full-bodied red wine with dark fruit notes.',
          flavor_profile: {
            acidity: '6',
            tannin: '7',
            body: '8',
            sweetness: '2',
            alcohol: '7',
          },
          food_pairings: ['steak', 'grilled lamb'],
          price_range: 'affordable',
          why_recommended: 'Bold enough for steak and still approachable.',
        },
      ],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.total_results).toBe(1)
      expect(result.data.wines[0].style).toBe('red')
      expect(result.data.wines[0].price_range).toBe('budget')
      expect(result.data.wines[0].flavor_profile?.body).toBe(8)
    }
  })

  it('rejects responses without at least one wine', () => {
    const result = WineSearchResponseSchema.safeParse({
      wines: [],
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid required wine fields', () => {
    const result = WineSearchResponseSchema.safeParse({
      wines: [
        {
          name: '',
          style: 'red',
        },
      ],
    })

    expect(result.success).toBe(false)
  })
})

describe('normalizers', () => {
  it('normalizes wine style variations', () => {
    expect(WineStyleSchema.parse('Red')).toBe('red')
    expect(WineStyleSchema.parse('rose')).toBe('rosé')
    expect(WineStyleSchema.parse('rosy')).toBe('rosé')
  })

  it('normalizes price range variations', () => {
    expect(PriceRangeSchema.parse('cheap')).toBe('budget')
    expect(PriceRangeSchema.parse('affordable')).toBe('budget')
    expect(PriceRangeSchema.parse('premium')).toBe('premium')
    expect(PriceRangeSchema.parse('expensive')).toBe('luxury')
    expect(PriceRangeSchema.parse('normal')).toBe('mid')
  })
})
