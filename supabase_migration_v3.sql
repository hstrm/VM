-- ============================================
-- VM TIPSET 2026 — Migration v3
-- Auth + säker RLS + roller + deadlines
-- Kör i Supabase > SQL Editor
-- ============================================

-- 0. Aktivera anonymous sign-in:
--    Supabase Dashboard > Authentication > Providers > Anonymous Sign-ins = ON
--    (Detta steget gör du i UI:t, inte i SQL.)

-- 1. Roller
CREATE TYPE app_role AS ENUM ('admin');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own roles" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. Knyt users-tabellen till auth.users
--    Vi byter PK så att users.id = auth.uid().
ALTER TABLE tips DROP CONSTRAINT IF EXISTS tips_user_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;

-- Töm gamla testanvändare (de hade slumpade UUIDs, ej kopplade till auth)
TRUNCATE tips, users RESTART IDENTITY;

ALTER TABLE users
  ALTER COLUMN id DROP DEFAULT,
  ADD PRIMARY KEY (id),
  ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE tips
  ADD CONSTRAINT tips_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. Auto-skapa users-rad vid signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Anonym')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 4. Per-match deadline för tipsning
ALTER TABLE matches ADD COLUMN IF NOT EXISTS tip_deadline TIMESTAMPTZ;

-- Gruppspel: deadline 11 juni 2026 kl 19:00 svensk tid (CEST = UTC+2)
UPDATE matches
SET tip_deadline = '2026-06-11 17:00:00+00'  -- = 19:00 CEST
WHERE round = 'group';

-- Slutspel: när du lägger till en match anger admin tip_deadline manuellt
--           (default = NULL betyder ej öppen för tips ännu)

-- 5. NYA RLS-policys (rensar gamla osäkra)
DROP POLICY IF EXISTS "Public read users"      ON users;
DROP POLICY IF EXISTS "Public insert users"    ON users;
DROP POLICY IF EXISTS "Public read tips"       ON tips;
DROP POLICY IF EXISTS "Public insert tips"     ON tips;
DROP POLICY IF EXISTS "Public update tips"     ON tips;
DROP POLICY IF EXISTS "Public read results"    ON results;
DROP POLICY IF EXISTS "Admin insert matches"   ON matches;
DROP POLICY IF EXISTS "Admin update matches"   ON matches;
DROP POLICY IF EXISTS "Admin delete matches"   ON matches;
DROP POLICY IF EXISTS "Admin insert results"   ON results;
DROP POLICY IF EXISTS "Admin update results"   ON results;
DROP POLICY IF EXISTS "Public read matches"    ON matches;

-- USERS: alla inloggade kan läsa (för highscore), bara man själv kan uppdatera
CREATE POLICY "Auth read users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Update own user" ON users
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- MATCHES: alla inloggade läser, bara admin skriver
CREATE POLICY "Auth read matches" ON matches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin write matches" ON matches
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- TIPS: läs alla, men skriv bara dina egna OCH bara före deadline
CREATE POLICY "Auth read tips" ON tips
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Insert own tip before deadline" ON tips
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND m.is_tippable = true
        AND m.tip_deadline IS NOT NULL
        AND now() < m.tip_deadline
    )
  );

CREATE POLICY "Update own tip before deadline" ON tips
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND m.is_tippable = true
        AND m.tip_deadline IS NOT NULL
        AND now() < m.tip_deadline
    )
  );

-- RESULTS: alla läser, bara admin skriver
CREATE POLICY "Auth read results" ON results
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin write results" ON results
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- 6. Index för fart
CREATE INDEX IF NOT EXISTS idx_tips_user    ON tips(user_id);
CREATE INDEX IF NOT EXISTS idx_tips_match   ON tips(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_round ON matches(round);

-- 7. Realtime — slå på live-uppdateringar
ALTER PUBLICATION supabase_realtime ADD TABLE tips, results;
