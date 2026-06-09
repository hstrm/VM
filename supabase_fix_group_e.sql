-- Fixa Grupp E: ta bort Nederländerna och Japan, ersätt med rätt matcher
DELETE FROM matches WHERE round = 'group' AND group_name = 'E';

INSERT INTO matches (round, group_name, home, away, match_date, match_time, venue, is_tippable) VALUES
('group','E','Tyskland','Curaçao',         '2026-06-14','19:00','Chicago',     true),
('group','E','Elfenbenskusten','Ecuador',  '2026-06-15','01:00','Dallas',      true),
('group','E','Tyskland','Elfenbenskusten', '2026-06-20','22:00','New York',    true),
('group','E','Ecuador','Curaçao',          '2026-06-21','02:00','Miami',       true),
('group','E','Curaçao','Elfenbenskusten',  '2026-06-25','22:00','Atlanta',     true),
('group','E','Ecuador','Tyskland',         '2026-06-25','22:00','Houston',     true);
