# Wine AI

**Your personal AI sommelier — discover wines, scan labels, build your collection.**

Wine AI lets you explore wine through natural language search, instant label scanning, and a personal wine journal. Powered by Groq's fast inference models.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/AI-Groq-D97706?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

---

## Features

- **Natural language search** — ask for "bold reds under €20" or "something like Rioja" and get expert recommendations with full tasting profiles.
- **Label scanner** — point your camera at any wine label. AI Vision extracts name, region, vintage, tasting notes, and food pairings instantly.
- **Personal journal** — save wines, add notes, and track everything you've tasted.
- **Achievements** — earn badges as you explore: first pour, label detective, world traveler, and more.
- **Rate limiting** — per-user request throttling with countdown UI on Groq 429 responses.
- **Secure** — API keys encrypted server-side, Row Level Security on all tables, keys never appear in HTTP responses.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database / Auth | Supabase (PostgreSQL + RLS) |
| State | Zustand |
| AI — Search | Groq · Llama 3.3 70B (SSE streaming) |
| AI — Scan | Groq · Llama 4 Scout Vision |
| Validation | Zod |
| Analytics | Vercel Analytics |
| Tests | Vitest |

---

## Architecture

All AI calls are server-side. The client never touches an API key.

```
User → Next.js UI → API Route → Groq → Zod validation → UI
                         ↕
                    Supabase (auth + DB)
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
git clone https://github.com/TigranBabujyan/wine_ai-assistant.git
cd wine_ai-assistant
npm install
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
```

### Database

Run the four migration files in order in your Supabase SQL editor:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_api_key_functions.sql
supabase/migrations/004_provider_selection.sql
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Tests

```bash
npm test
```

---

## Author

**Tigran Babujyan**

- GitHub: [github.com/TigranBabujyan](https://github.com/TigranBabujyan)
- LinkedIn: [linkedin.com/in/tigran-babujyan](https://www.linkedin.com/in/tigran-babujyan/)
