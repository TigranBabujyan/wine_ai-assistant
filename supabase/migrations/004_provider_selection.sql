-- User AI provider preferences
-- Tracks which provider the user has selected for AI features

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_provider TEXT NOT NULL DEFAULT 'anthropic',
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Update save_api_key to accept a provider parameter
CREATE OR REPLACE FUNCTION save_api_key(
  p_user_id    UUID,
  p_key        TEXT,
  p_hint       TEXT,
  p_model_pref TEXT DEFAULT 'fast',
  p_provider   TEXT DEFAULT 'anthropic'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO api_keys (user_id, provider, key_encrypted, key_hint, model_pref)
  VALUES (
    p_user_id,
    p_provider,
    pgp_sym_encrypt(p_key, current_setting('app.encryption_secret')),
    p_hint,
    p_model_pref
  )
  ON CONFLICT (user_id, provider) DO UPDATE
    SET key_encrypted = pgp_sym_encrypt(p_key, current_setting('app.encryption_secret')),
        key_hint      = p_hint,
        model_pref    = p_model_pref,
        is_active     = TRUE,
        updated_at    = NOW();
END;
$$;

-- Upsert user's selected provider preference
CREATE OR REPLACE FUNCTION set_selected_provider(
  p_user_id  UUID,
  p_provider TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_preferences (user_id, selected_provider)
  VALUES (p_user_id, p_provider)
  ON CONFLICT (user_id) DO UPDATE
    SET selected_provider = p_provider,
        updated_at        = NOW();
END;
$$;
