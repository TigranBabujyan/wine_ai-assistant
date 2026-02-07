-- Supabase RPC functions for API key encryption/decryption
-- These run server-side with the service role, key never leaves the DB unencrypted

-- Save (upsert) an encrypted API key
CREATE OR REPLACE FUNCTION save_api_key(
  p_user_id UUID,
  p_key TEXT,
  p_hint TEXT,
  p_model_pref TEXT DEFAULT 'haiku'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO api_keys (user_id, provider, key_encrypted, key_hint, model_pref)
  VALUES (
    p_user_id,
    'anthropic',
    pgp_sym_encrypt(p_key, current_setting('app.encryption_secret')),
    p_hint,
    p_model_pref
  )
  ON CONFLICT (user_id, provider) DO UPDATE
    SET key_encrypted = pgp_sym_encrypt(p_key, current_setting('app.encryption_secret')),
        key_hint = p_hint,
        model_pref = p_model_pref,
        is_active = TRUE,
        updated_at = NOW();
END;
$$;

-- Decrypt an API key (user must own it — RLS enforced on read)
CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    encrypted_key::bytea,
    current_setting('app.encryption_secret')
  );
END;
$$;

-- Set the encryption secret as a DB setting (run once after deploy)
-- ALTER DATABASE postgres SET app.encryption_secret = 'your-secret-here';
-- Or set via Supabase dashboard: Settings > Database > Configuration
