-- ============================================
-- VM TIPSET 2026 — Rätta matcher
-- Tar bort felaktiga matcher och lägger in
-- officiella gruppspelsmatcher (svensk tid)
-- ============================================

-- Rensa gamla felaktiga matcher (tips och resultat raderas automatiskt via CASCADE)
DELETE FROM matches WHERE round = 'group';

-- Lägg in alla 72 officiella gruppspelsmatcher
-- Tider är i SVENSK TID (CET/CEST = lokal tid + 6-7h)
INSERT INTO matches (round, group_name, home, away, match_date, match_time, venue, is_tippable) VALUES

-- GRUPP A: Mexiko, Sydkorea, Sydafrika, Tjeckien
('group','A','Mexiko','Sydafrika',      '2026-06-11','21:00','Mexico City',   true),
('group','A','Sydkorea','Tjeckien',     '2026-06-12','04:00','Guadalajara',   true),
('group','A','Mexiko','Sydkorea',       '2026-06-19','03:00','Guadalajara',   true),
('group','A','Tjeckien','Sydafrika',    '2026-06-18','18:00','Dallas',        true),
('group','A','Sydafrika','Sydkorea',    '2026-06-25','03:00','Kansas City',   true),
('group','A','Tjeckien','Mexiko',       '2026-06-25','03:00','Houston',       true),

-- GRUPP B: Kanada, Schweiz, Qatar, Bosnien och Hercegovina
('group','B','Kanada','Bosnien & Hercegovina', '2026-06-12','21:00','Toronto',       true),
('group','B','Qatar','Schweiz',                '2026-06-13','21:00','San Francisco', true),
('group','B','Kanada','Qatar',                 '2026-06-19','00:00','Vancouver',     true),
('group','B','Schweiz','Bosnien & Hercegovina','2026-06-18','21:00','Kansas City',   true),
('group','B','Schweiz','Kanada',               '2026-06-24','21:00','Seattle',       true),
('group','B','Bosnien & Hercegovina','Qatar',  '2026-06-24','21:00','Dallas',        true),

-- GRUPP C: Brasilien, Marocko, Skottland, Haiti
('group','C','Brasilien','Marocko',  '2026-06-14','00:00','New York',      true),
('group','C','Haiti','Skottland',    '2026-06-14','03:00','Boston',        true),
('group','C','Brasilien','Haiti',    '2026-06-20','03:00','Los Angeles',   true),
('group','C','Skottland','Marocko',  '2026-06-20','00:00','Atlanta',       true),
('group','C','Marocko','Haiti',      '2026-06-25','00:00','Miami',         true),
('group','C','Skottland','Brasilien','2026-06-25','00:00','San Francisco', true),

-- GRUPP D: USA, Australien, Paraguay, Turkiet
('group','D','USA','Paraguay',       '2026-06-13','03:00','Los Angeles',  true),
('group','D','Australien','Turkiet', '2026-06-14','06:00','Atlanta',      true),
('group','D','USA','Australien',     '2026-06-19','21:00','Kansas City',  true),
('group','D','Turkiet','Paraguay',   '2026-06-20','06:00','Dallas',       true),
('group','D','Turkiet','USA',        '2026-06-26','04:00','Miami',        true),
('group','D','Paraguay','Australien','2026-06-26','04:00','Houston',      true),

-- GRUPP E: Tyskland, Ecuador, Elfenbenskusten, Curaçao
('group','E','Tyskland','Curaçao',       '2026-06-14','19:00','Chicago',      true),
('group','E','Nederländerna','Japan',    '2026-06-14','22:00','Los Angeles',  true),
('group','E','Tyskland','Elfenbenskusten','2026-06-20','22:00','New York',    true),
('group','E','Ecuador','Curaçao',        '2026-06-21','02:00','Miami',        true),
('group','E','Curaçao','Elfenbenskusten','2026-06-25','22:00','Dallas',       true),
('group','E','Ecuador','Tyskland',       '2026-06-25','22:00','Houston',      true),

-- GRUPP F: Nederländerna, Japan, Tunisien, Sverige
('group','F','Sverige','Tunisien',        '2026-06-15','04:00','Guadalajara',  true),
('group','F','Nederländerna','Japan',     '2026-06-14','22:00','Los Angeles',  true),
('group','F','Nederländerna','Sverige',   '2026-06-20','19:00','Philadelphia', true),
('group','F','Tunisien','Japan',          '2026-06-21','06:00','Dallas',       true),
('group','F','Tunisien','Nederländerna',  '2026-06-26','01:00','Atlanta',      true),
('group','F','Japan','Sverige',           '2026-06-26','01:00','Boston',       true),

-- GRUPP G: Belgien, Iran, Egypten, Nya Zeeland
('group','G','Belgien','Egypten',    '2026-06-15','21:00','Miami',        true),
('group','G','Iran','Nya Zeeland',   '2026-06-16','03:00','Seattle',      true),
('group','G','Belgien','Iran',       '2026-06-21','21:00','Los Angeles',  true),
('group','G','Nya Zeeland','Egypten','2026-06-22','03:00','Dallas',       true),
('group','G','Nya Zeeland','Belgien','2026-06-27','05:00','Kansas City',  true),
('group','G','Egypten','Iran',       '2026-06-27','05:00','New York',     true),

-- GRUPP H: Spanien, Uruguay, Saudiarabien, Kap Verde
('group','H','Spanien','Kap Verde',    '2026-06-15','18:00','San Francisco', true),
('group','H','Saudiarabien','Uruguay', '2026-06-16','00:00','Houston',       true),
('group','H','Spanien','Saudiarabien', '2026-06-21','18:00','Seattle',       true),
('group','H','Uruguay','Kap Verde',    '2026-06-22','00:00','Philadelphia',  true),
('group','H','Kap Verde','Saudiarabien','2026-06-27','02:00','Atlanta',      true),
('group','H','Uruguay','Spanien',      '2026-06-27','02:00','Miami',         true),

-- GRUPP I: Frankrike, Senegal, Norge, Irak
('group','I','Frankrike','Senegal',  '2026-06-16','21:00','New York',     true),
('group','I','Irak','Norge',         '2026-06-17','00:00','San Francisco', true),
('group','I','Frankrike','Irak',     '2026-06-23','23:00','Chicago',      true),
('group','I','Norge','Senegal',      '2026-06-23','02:00','Dallas',       true),
('group','I','Norge','Frankrike',    '2026-06-26','21:00','Houston',      true),
('group','I','Senegal','Irak',       '2026-06-26','21:00','Kansas City',  true),

-- GRUPP J: Argentina, Österrike, Algeriet, Jordanien
('group','J','Argentina','Algeriet', '2026-06-17','03:00','Dallas',        true),
('group','J','Österrike','Jordanien','2026-06-17','06:00','New York',      true),
('group','J','Argentina','Österrike','2026-06-22','19:00','Los Angeles',   true),
('group','J','Jordanien','Algeriet', '2026-06-23','05:00','Atlanta',       true),
('group','J','Jordanien','Argentina','2026-06-28','04:00','Seattle',       true),
('group','J','Algeriet','Österrike', '2026-06-28','04:00','Miami',         true),

-- GRUPP K: Portugal, Colombia, Uzbekistan, Kongo-Kinshasa
('group','K','Portugal','Kongo-Kinshasa','2026-06-17','19:00','Kansas City', true),
('group','K','Uzbekistan','Colombia',    '2026-06-18','04:00','Houston',     true),
('group','K','Portugal','Uzbekistan',    '2026-06-23','19:00','Boston',      true),
('group','K','Colombia','Kongo-Kinshasa','2026-06-24','04:00','Chicago',     true),
('group','K','Kongo-Kinshasa','Uzbekistan','2026-06-28','01:30','San Francisco', true),
('group','K','Colombia','Portugal',      '2026-06-28','01:30','Dallas',      true),

-- GRUPP L: England, Kroatien, Panama, Ghana
('group','L','England','Kroatien',  '2026-06-17','22:00','Philadelphia', true),
('group','L','Ghana','Panama',      '2026-06-18','01:00','Boston',       true),
('group','L','England','Ghana',     '2026-06-23','22:00','Seattle',      true),
('group','L','Panama','Kroatien',   '2026-06-24','01:00','Los Angeles',  true),
('group','L','Panama','England',    '2026-06-27','23:00','Atlanta',      true),
('group','L','Kroatien','Ghana',    '2026-06-27','23:00','Miami',        true);

