import { describe, it, expect, beforeEach } from 'vitest'

// Re-import fresh module each test to reset in-memory state
// We test the rate limit logic by calling through many times

describe('checkRateLimit', () => {
  // Use a unique userId per test group to avoid state bleed
  const uid = () => `test-${Math.random().toString(36).slice(2)}`

  it('allows first request', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const result = checkRateLimit(uid())
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBeGreaterThanOrEqual(0)
  })

  it('remaining decreases with each request', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const id = uid()
    const first = checkRateLimit(id)
    const second = checkRateLimit(id)
    expect(second.remaining).toBe(first.remaining - 1)
  })

  it('blocks after exhausting all tokens', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const id = uid()
    // Drain all 10 tokens
    for (let i = 0; i < 10; i++) checkRateLimit(id)
    const blocked = checkRateLimit(id)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('different users have independent buckets', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const idA = uid()
    const idB = uid()
    // Drain idA
    for (let i = 0; i < 10; i++) checkRateLimit(idA)
    // idB should still be allowed
    const result = checkRateLimit(idB)
    expect(result.allowed).toBe(true)
  })

  it('scan and search use separate buckets via key prefix', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const base = uid()
    // Drain search bucket
    for (let i = 0; i < 10; i++) checkRateLimit(base)
    // scan: uses `scan:${userId}` key — should be independent
    const scanResult = checkRateLimit(`scan:${base}`)
    expect(scanResult.allowed).toBe(true)
  })
})
