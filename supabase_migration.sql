-- ============================================
-- VM TIPSET 2026 — Migration (kör detta om du
-- redan har kört det gamla schemat)
-- ============================================

-- 1. Skapa den nya matches-tabellen
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  round TEXT NOT NULL,
  group_name TEXT,
  home TEXT NOT NULL,
  away TEXT NOT NULL,
  match_date DATE,
  match_time TEXT,
  venue TEXT,
  is_tippable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Uppdatera tips-tabellen: byt match_id från INTEGER till FK mot matches
--    (gamla tips-rader raderas, men det finns inga riktiga ännu)
ALTER TABLE tips DROP CONSTRAINT IF EXISTS tips_match_id_fkey;
ALTER TABLE tips ALTER COLUMN match_id TYPE INTEGER;

-- 3. Uppdatera results-tabellen: lägg till FK mot matches
ALTER TABLE results DROP CONSTRAINT IF EXISTS results_match_id_fkey;
ALTER TABLE results ALTER COLUMN match_id TYPE INTEGER;
ALTER TABLE results ADD CONSTRAINT results_match_id_fkey
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;

-- 4. RLS för matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read matches"  ON matches;
DROP POLICY IF EXISTS "Admin insert matches" ON matches;
DROP POLICY IF EXISTS "Admin update matches" ON matches;
DROP POLICY IF EXISTS "Admin delete matches" ON matches;

CREATE POLICY "Public read matches"  ON matches FOR SELECT USING (true);
CREATE POLICY "Admin insert matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update matches" ON matches FOR UPDATE USING (true);
CREATE POLICY "Admin delete matches" ON matches FOR DELETE USING (true);

-- 5. Seed: alla 72 gruppspelsmatcher
INSERT INTO matches (round, group_name, home, away, match_date, match_time, venue, is_tippable) VALUES
('group','A','Mexico','South Africa','2026-06-11','21:00','Mexico City',true),
('group','A','USA','Paraguay','2026-06-12','21:00','Los Angeles',true),
('group','A','Mexico','Paraguay','2026-06-16','18:00','Mexico City',true),
('group','A','USA','South Africa','2026-06-16','21:00','New York',true),
('group','A','Mexico','USA','2026-06-22','21:00','Dallas',true),
('group','A','South Africa','Paraguay','2026-06-22','21:00','Seattle',true),
('group','B','Canada','Bosnia & Herzegovina','2026-06-12','18:00','Toronto',true),
('group','B','Argentina','Serbia','2026-06-12','00:00','Miami',true),
('group','B','Canada','Argentina','2026-06-17','00:00','Vancouver',true),
('group','B','Bosnia & Herzegovina','Serbia','2026-06-16','21:00','Dallas',true),
('group','B','Serbia','Canada','2026-06-21','18:00','Seattle',true),
('group','B','Bosnia & Herzegovina','Argentina','2026-06-21','21:00','Los Angeles',true),
('group','C','Spain','Portugal','2026-06-13','00:00','Kansas City',true),
('group','C','Morocco','Senegal','2026-06-13','18:00','Toronto',true),
('group','C','Spain','Morocco','2026-06-17','21:00','Miami',true),
('group','C','Portugal','Senegal','2026-06-17','18:00','Atlanta',true),
('group','C','Portugal','Morocco','2026-06-22','18:00','Chicago',true),
('group','C','Senegal','Spain','2026-06-22','18:00','New York',true),
('group','D','France','Nigeria','2026-06-13','21:00','New York',true),
('group','D','Brazil','Morocco','2026-06-13','21:00','Houston',true),
('group','D','France','Brazil','2026-06-19','00:00','Dallas',true),
('group','D','Morocco','Nigeria','2026-06-18','21:00','Los Angeles',true),
('group','D','Brazil','Nigeria','2026-06-23','18:00','Seattle',true),
('group','D','France','Morocco','2026-06-23','18:00','San Francisco',true),
('group','E','Germany','Saudi Arabia','2026-06-14','18:00','New York',true),
('group','E','Netherlands','Ecuador','2026-06-14','21:00','Chicago',true),
('group','E','Germany','Netherlands','2026-06-18','18:00','Houston',true),
('group','E','Saudi Arabia','Ecuador','2026-06-18','21:00','Kansas City',true),
('group','E','Netherlands','Saudi Arabia','2026-06-23','21:00','Miami',true),
('group','E','Ecuador','Germany','2026-06-23','21:00','Atlanta',true),
('group','F','England','Tunisia','2026-06-14','00:00','Miami',true),
('group','F','Colombia','Nigeria','2026-06-14','21:00','Los Angeles',true),
('group','F','England','Colombia','2026-06-19','21:00','New York',true),
('group','F','Tunisia','Nigeria','2026-06-19','18:00','Kansas City',true),
('group','F','Colombia','Tunisia','2026-06-24','18:00','Boston',true),
('group','F','Nigeria','England','2026-06-24','18:00','San Francisco',true),
('group','G','Japan','Czech Republic','2026-06-15','18:00','Los Angeles',true),
('group','G','Croatia','Belgium','2026-06-15','21:00','Dallas',true),
('group','G','Japan','Croatia','2026-06-19','21:00','Houston',true),
('group','G','Czech Republic','Belgium','2026-06-19','18:00','Seattle',true),
('group','G','Croatia','Czech Republic','2026-06-24','21:00','San Francisco',true),
('group','G','Belgium','Japan','2026-06-24','21:00','Chicago',true),
('group','H','South Korea','Colombia','2026-06-15','00:00','New York',true),
('group','H','Australia','Slovakia','2026-06-15','18:00','Atlanta',true),
('group','H','South Korea','Australia','2026-06-20','00:00','Kansas City',true),
('group','H','Colombia','Slovakia','2026-06-19','21:00','Dallas',true),
('group','H','Australia','Colombia','2026-06-24','21:00','Miami',true),
('group','H','Slovakia','South Korea','2026-06-24','21:00','Boston',true),
('group','I','Italy','Albania','2026-06-16','18:00','Los Angeles',true),
('group','I','Denmark','Chile','2026-06-16','21:00','Vancouver',true),
('group','I','Italy','Denmark','2026-06-20','21:00','Chicago',true),
('group','I','Albania','Chile','2026-06-20','18:00','Houston',true),
('group','I','Denmark','Albania','2026-06-25','18:00','Atlanta',true),
('group','I','Chile','Italy','2026-06-25','18:00','Seattle',true),
('group','J','Iran','Greece','2026-06-16','21:00','Dallas',true),
('group','J','Uruguay','Côte d''Ivoire','2026-06-17','00:00','San Francisco',true),
('group','J','Iran','Uruguay','2026-06-21','18:00','Houston',true),
('group','J','Greece','Côte d''Ivoire','2026-06-20','21:00','Miami',true),
('group','J','Uruguay','Greece','2026-06-25','21:00','New York',true),
('group','J','Côte d''Ivoire','Iran','2026-06-25','21:00','Kansas City',true),
('group','K','Portugal','Hungary','2026-06-17','18:00','Toronto',true),
('group','K','Algeria','Egypt','2026-06-17','21:00','Boston',true),
('group','K','Portugal','Algeria','2026-06-21','21:00','New York',true),
('group','K','Hungary','Egypt','2026-06-21','18:00','Los Angeles',true),
('group','K','Algeria','Hungary','2026-06-26','18:00','Chicago',true),
('group','K','Egypt','Portugal','2026-06-26','18:00','Dallas',true),
('group','L','Ukraine','Jamaica','2026-06-17','21:00','Seattle',true),
('group','L','Poland','Turkey','2026-06-17','18:00','Atlanta',true),
('group','L','Ukraine','Poland','2026-06-22','00:00','Kansas City',true),
('group','L','Jamaica','Turkey','2026-06-22','00:00','Houston',true),
('group','L','Poland','Jamaica','2026-06-26','18:00','San Francisco',true),
('group','L','Turkey','Ukraine','2026-06-26','18:00','Miami',true);
