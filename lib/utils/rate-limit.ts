// Simple in-memory token bucket rate limiter.
// For production with multiple instances, replace with Upstash Redis.
interface Bucket {
  tokens: number
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

const RATE_LIMIT_REQUESTS = 10    // requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000  // per minute

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  let bucket = buckets.get(userId)

  if (!bucket || now - bucket.lastRefill > RATE_LIMIT_WINDOW_MS) {
    bucket = { tokens: RATE_LIMIT_REQUESTS, lastRefill: now }
  }

  if (bucket.tokens <= 0) {
    buckets.set(userId, bucket)
    return { allowed: false, remaining: 0 }
  }

  bucket.tokens -= 1
  buckets.set(userId, bucket)
  return { allowed: true, remaining: bucket.tokens }
}
