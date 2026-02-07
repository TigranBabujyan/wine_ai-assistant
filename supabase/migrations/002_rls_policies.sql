-- Row Level Security Policies
-- Users can only access their own data

-- wines
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own wines" ON wines
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- scans
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own scans" ON scans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own notes" ON notes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- api_keys — most sensitive, extra care
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own api_keys" ON api_keys
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
