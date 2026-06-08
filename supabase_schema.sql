-- ============================================
-- VM TIPSET 2026 — Supabase SQL Schema
-- Kör detta i Supabase > SQL Editor
-- ============================================

-- 1. Användare
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,         -- lowercase, unik nyckel
  display_name TEXT NOT NULL,             -- visas i UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tips (en rad per användare + match)
CREATE TABLE tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL,
  home_goals INTEGER,
  away_goals INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- 3. Resultat (adminifyllt)
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id INTEGER UNIQUE NOT NULL,
  home_goals INTEGER NOT NULL,
  away_goals INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) — öppet för läsning
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Alla kan läsa allt
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public read tips" ON tips FOR SELECT USING (true);
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);

-- Alla kan skriva tips och users (ingen inloggning krävs)
CREATE POLICY "Public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert tips" ON tips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tips" ON tips FOR UPDATE USING (true);

-- Resultat skrivs bara via admin (service_role key i .env)
-- Tips: använd VITE_SUPABASE_ADMIN_KEY i adminläge för resultat
CREATE POLICY "Admin insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update results" ON results FOR UPDATE USING (true);
