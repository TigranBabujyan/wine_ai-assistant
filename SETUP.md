   # Setup Guide — Wine AI Assistant

Complete setup from zero to running dev server.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account)
2. Click **New project** → choose a name (e.g. `wine-ai`) → set a database password → select a region close to you
3. Wait ~2 minutes for the project to spin up
4. Go to **Settings → API** — you'll need:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)

---

## 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate a strong random secret:
# Run: openssl rand -base64 32
DB_ENCRYPTION_SECRET=your-generated-secret-here
```

---

## 3. Run database migrations

In the **Supabase Dashboard**, go to **SQL Editor** and run these 3 files **in order**:

### Step 3a — `supabase/migrations/001_initial_schema.sql`
Creates all tables: `wines`, `scans`, `notes`, `achievements`, `api_keys`.

### Step 3b — `supabase/migrations/002_rls_policies.sql`
Enables Row Level Security on all tables — users can only access their own data.

### Step 3c — `supabase/migrations/003_api_key_functions.sql`
Creates the `save_api_key` and `decrypt_api_key` SQL functions used for encryption.

### Step 3d — Set the encryption secret

In Supabase SQL Editor, run:

```sql
ALTER DATABASE postgres SET app.encryption_secret = 'paste-your-DB_ENCRYPTION_SECRET-value-here';
```

Replace `paste-your-DB_ENCRYPTION_SECRET-value-here` with the same value you put in `.env.local`.

---

## 4. Configure Supabase Auth (email confirmation)

For development, disable email confirmation to make testing easier:

1. Go to **Authentication → Providers → Email**
2. Toggle **"Confirm email"** OFF
3. Save

You can re-enable this for production.

---

## 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 6. First run walkthrough

1. Click **Get Started Free** → **Create Account** → sign up with any email/password
2. You'll be redirected to `/dashboard` — it's empty for now
3. Go to **Settings** (`/settings`)
4. Paste your **Anthropic API key** (get one at [console.anthropic.com](https://console.anthropic.com))
   - The key format is `sk-ant-api03-...`
   - It will be tested and encrypted before storage
5. Go to **AI Search** (`/search`) → try: `"light red wine for pasta"`
6. Save a wine to your journal → go to **My Journal**
7. Go to **Scan Label** (`/scan`) → upload a photo of any wine bottle label

---

## 7. Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for automatic deploys.

**Set these environment variables in Vercel dashboard:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DB_ENCRYPTION_SECRET`

**Important:** After deploying, update the Supabase auth settings:
1. Go to **Authentication → URL Configuration**
2. Add your Vercel URL to **Site URL** (e.g. `https://wine-ai.vercel.app`)
3. Add `https://wine-ai.vercel.app/**` to **Redirect URLs**

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "No API key found" on search | Go to Settings and add your Anthropic key |
| Auth redirect loop | Check SUPABASE_URL and ANON_KEY in .env.local |
| "Failed to retrieve API key" | Make sure you ran migration 003 and set the DB encryption secret |
| Scan returns no data | Check your Anthropic key has sufficient credits |
| Build fails | Run `npx tsc --noEmit` to see TypeScript errors |
