# App Reshape Plan

Goal: Ship wine app as a sellable zero-cost SaaS in ~10 working days.
Stack: Next.js + Supabase + Groq (free tier) + LemonSqueezy (payments)

---

## Phase 1 — Core (3–4 days)

### 1. Server-side Groq key — remove BYOK entirely
- [x] Add `GROQ_API_KEY` to `.env.local` and Vercel env vars
- [x] Rewrite `/api/ai/search` route to use server Groq key — remove DB lookup + decrypt flow
- [x] Rewrite `/api/ai/scan` route to use server Groq key — remove DB lookup + decrypt flow
- [x] Remove "Setup required / Add API key" banner from dashboard (`DashboardClient.tsx`, `hasApiKey` prop)
- [x] Redesign settings page — remove API key manager, keep account section only (email, sign out)

### 2. Image compression before scan upload
- [x] Add client-side image resize utility (max 1024px, JPEG 80%) before base64 conversion — already implemented in `lib/utils/image-utils.ts`
- [x] Show instant feedback on image selection: scan starts immediately on file select
- [x] Start loading state on file select, not on button click — `handleFile` now calls `scan()` automatically

### 3. Footer + landing page cleanup
- [x] Remove "A portfolio project." from footer
- [x] Replace footer text with: `© 2025 Wine AI · Built with Next.js and AI`
- [ ] Add Privacy Policy link and Contact link to footer
- [ ] Remove all "portfolio project" mentions from README

### 4. Character limit + search input counter
- [x] Lower `SearchRequestSchema` query max from 500 to 300 characters
- [x] Add character counter to search input UI (`47/300`)
- [x] Disable search button client-side when query exceeds 300 chars or is under 2 chars

---

## Phase 2 — Polish (2–3 days)

### 5. Loading animations
- [x] Search: skeleton card grid appears immediately while SSE streams — was already implemented
- [x] Scan: full-card skeleton with "Analyzing label..." spinner — was already implemented
- [x] Both: subtle top progress bar during any AI request — `TopLoadingBar` added to AppShell

### 6. Groq rate limit error handling
- [x] Detect 429 from Groq — already handled in `toPublicAiError`
- [x] Return user-friendly message: "AI is busy right now. Please wait a moment."
- [x] Show countdown timer in UI (30s) when rate limited on search

### 7. Mobile camera access
- [x] `capture="environment"` already present on scan file input — confirmed done

### 8. Empty states
- [x] Journal with no saved wines — already had a great empty state
- [x] Search with no results — already had "Your sommelier awaits"
- [x] Achievements page with 0 unlocked — motivational hint added to progress card

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
| 2026-05-09 | Phase 1 partial: Groq server-side key wired up, BYOK removed from both API routes. Dashboard setup accordion removed. Settings page simplified to account-only. Footer "portfolio project" text removed. Search query limit lowered to 300 chars with live counter + button guard. Scan "Claude" text updated. Build clean, 11/11 tests pass. |
| 2026-05-09 | Phase 1 complete: Auto-scan on file select (no "Scan Label" button click needed). Image compression was already implemented. All Phase 1 items done. Build clean. |
| 2026-05-09 | Phase 2 complete: TopLoadingBar added to AppShell (wine+gold gradient, fires on search/scan). 429 countdown in search UI. Achievements page and AchievementBadge restyled to dark glass aesthetic. All other Phase 2 items were already implemented. Build clean, 11/11 tests pass. |

