# App Reshape Plan

Goal: Ship wine app as a sellable zero-cost SaaS in ~10 working days.
Stack: Next.js + Supabase + Groq (free tier) + LemonSqueezy (payments)

---

## Phase 1 — Core (3–4 days)

### 1. Server-side Groq key — remove BYOK entirely
- [ ] Add `GROQ_API_KEY` to `.env.local` and Vercel env vars
- [ ] Rewrite `/api/ai/search` route to use server Groq key — remove DB lookup + decrypt flow
- [ ] Rewrite `/api/ai/scan` route to use server Groq key — remove DB lookup + decrypt flow
- [ ] Remove "Setup required / Add API key" banner from dashboard (`DashboardClient.tsx`, `hasApiKey` prop)
- [ ] Redesign settings page — remove API key manager, keep account section only (email, sign out)

### 2. Image compression before scan upload
- [ ] Add client-side image resize utility (max 1024px, JPEG 80%) before base64 conversion
- [ ] Show instant feedback on image selection: "Image received — analyzing label..."
- [ ] Start loading state on file select, not on button click

### 3. Footer + landing page cleanup
- [ ] Remove "A portfolio project." from footer
- [ ] Replace footer text with: `© 2025 Wine AI · Built with Next.js and AI`
- [ ] Add Privacy Policy link and Contact link to footer
- [ ] Remove all "portfolio project" mentions from README

### 4. Character limit + search input counter
- [ ] Lower `SearchRequestSchema` query max from 500 to 300 characters
- [ ] Add character counter to search input UI (`47/300`)
- [ ] Disable search button client-side when query exceeds 300 chars or is under 2 chars

---

## Phase 2 — Polish (2–3 days)

### 5. Loading animations
- [ ] Search: skeleton card grid appears immediately while SSE streams
- [ ] Scan: full-card skeleton with "Analyzing label..." spinner — starts on image selection
- [ ] Both: subtle top progress bar during any AI request

### 6. Groq rate limit error handling
- [ ] Detect 429 from Groq in both routes
- [ ] Return user-friendly message: "AI is busy, try again in 30 seconds"
- [ ] Show countdown timer in UI when rate limited

### 7. Mobile camera access
- [ ] Add `capture="environment"` to scan file input so mobile opens camera directly

### 8. Empty states
- [ ] Journal with no saved wines — friendly empty state with CTA to search
- [ ] Search with no results — friendly message, not blank space
- [ ] Achievements page with 0 unlocked — motivational empty state

---

## Phase 3 — Launch Prep (1–2 days)

### 9. Tests — critical paths
- [ ] Search route: unauthenticated returns 401
- [ ] Search route: query over 300 chars returns 400
- [ ] Scan route: image too large returns 413
- [ ] Groq 429 handling returns graceful error event
- [ ] `buildDoneEvent`: malformed AI JSON returns error SSE event
- [ ] Image compression utility: output size is smaller than input

### 10. Privacy policy page
- [ ] Create `/privacy` static page — basic SaaS privacy policy

### 11. SEO meta tags
- [ ] Add `<title>`, `<meta description>`, OG image to landing page `layout.tsx`
- [ ] Verify meta tags render correctly on social share preview

### 12. Vercel analytics
- [ ] Add `@vercel/analytics` package (free, one line)
- [ ] Wrap layout with `<Analytics />` component

### 13. Final cleanup + deploy
- [ ] Commit all pending modified files (`WineCard.tsx`, `button.tsx`, `not-found.tsx`, `button-variants.ts`, `page.tsx`)
- [ ] Run Supabase migrations in production dashboard (4 SQL files in order)
- [ ] Deploy to Vercel, verify all routes work on live URL
- [ ] Run end-to-end smoke test: sign up → search → scan → save to journal → check achievements

---

## Post-Launch

- [ ] Submit to AppSumo
- [ ] Post on Product Hunt
- [ ] List on Flippa
- [ ] Add LemonSqueezy subscription ($9/month plan)

---

## Progress Log

| Date | What Was Done |
|------|---------------|
| 2026-05-09 | Plan created. App is at ~85% — build passes clean, env vars set, not yet deployed. |

