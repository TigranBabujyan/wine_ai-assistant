-- Wine AI Assistant — Initial Schema
-- Run via Supabase Dashboard SQL editor or supabase db push

-- Enable pgcrypto for API key encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- wines table
CREATE TABLE IF NOT EXISTS wines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  producer        TEXT,
  vintage         INTEGER,
  region          TEXT,
  country         TEXT,
  variety         TEXT[],
  style           TEXT CHECK (style IN ('red', 'white', 'rosé', 'sparkling', 'dessert')),
  description     TEXT,
  tasting_notes   JSONB,
  flavor_profile  JSONB,
  ai_summary      TEXT,
  label_image_url TEXT,
  source          TEXT NOT NULL CHECK (source IN ('search', 'scan', 'manual')),
  external_url    TEXT,
  saved_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- scans table
CREATE TABLE IF NOT EXISTS scans (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wine_id        UUID REFERENCES wines(id) ON DELETE SET NULL,
  image_url      TEXT NOT NULL,
  raw_response   JSONB,
  extracted_data JSONB,
  confidence     FLOAT,
  model_used     TEXT NOT NULL,
  tokens_used    INTEGER,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- notes table
CREATE TABLE IF NOT EXISTS notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id     UUID NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  rating      SMALLINT CHECK (rating BETWEEN 1 AND 5),
  occasion    TEXT,
  paired_with TEXT[],
  drunk_at    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  metadata    JSONB,
  UNIQUE(user_id, type)
);

-- api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL DEFAULT 'anthropic',
  key_encrypted TEXT NOT NULL,
  key_hint      TEXT,
  model_pref    TEXT NOT NULL DEFAULT 'haiku',
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS wines_user_id_idx ON wines(user_id);
CREATE INDEX IF NOT EXISTS wines_saved_at_idx ON wines(saved_at DESC);
CREATE INDEX IF NOT EXISTS scans_user_id_idx ON scans(user_id);
CREATE INDEX IF NOT EXISTS notes_wine_id_idx ON notes(wine_id);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS achievements_user_id_idx ON achievements(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wines_updated_at BEFORE UPDATE ON wines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER api_keys_updated_at BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
