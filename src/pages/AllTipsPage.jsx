import { useState, useEffect } from "react";
import { supabase, getMatches, getAllTips, getResults, calcPoints, GROUP_NAMES, DEADLINE, ROUNDS } from "../lib/supabase";

const isLocked = new Date() > DEADLINE;

export default function AllTipsPage() {
  const [matches, setMatches] = useState([]);
  const [allTips, setAllTips] = useState([]);
  const [results, setResults] = useState({});
  const [players, setPlayers] = useState([]);
  const [activeRound, setActiveRound] = useState("group");
  const [activeGroup, setActiveGroup] = useState("A");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allMatches, tips, allResults] = await Promise.all([
        getMatches(), getAllTips(), getResults(),
      ]);
      setMatches(allMatches);
      setAllTips(tips);

      const rMap = {};
      allResults.forEach((r) => (rMap[r.match_id] = r));
      setResults(rMap);

      // Hämta ALLA användare direkt från users-tabellen
      const { data: allUsers } = await supabase.from("users").select("id, display_name, username").order("display_name");
      setPlayers(allUsers || []);

      setLoading(false);
    }
    load();
  }, []);

  if (!isLocked) {
    return (
      <div className="alltips-locked">
        <div className="lock-icon">🔒</div>
        <h2>Tips visas efter stängning</h2>
        <p>Du kan se alla andras tips när tipsen låses den <strong>11 juni kl 19:00</strong>.</p>
        <p className="lock-sub">Annars är det ju inte kul att tippa!</p>
      </div>
    );
  }

  if (loading) return (
    <div className="loading-screen"><div className="loading-ball">⚽</div><p>Laddar tips...</p></div>
  );

  const visibleMatches = activeRound === "group"
    ? matches.filter((m) => m.round === "group" && m.group_name === activeGroup)
    : matches.filter((m) => m.round === activeRound && m.is_tippable);

  // matchId -> userId -> { home, away }
  const tipMap = {};
  allTips.forEach((t) => {
    if (!tipMap[t.match_id]) tipMap[t.match_id] = {};
    tipMap[t.match_id][t.user_id] = { home: t.home_goals, away: t.away_goals };
  });

  const availableRounds = ROUNDS.filter((r) => {
    if (r.key === "group") return true;
    return matches.some((m) => m.round === r.key && m.is_tippable);
  });

  return (
    <div className="alltips-page">
      <div className="tips-header">
        <div>
          <h2>Alla tips</h2>
          <p className="tips-subtitle">Vad tippade alla? ({players.length} spelare)</p>
        </div>
      </div>

      <div className="round-tabs">
        {availableRounds.map((r) => (
          <button key={r.key} className={`round-tab ${activeRound === r.key ? "active" : ""}`}
            onClick={() => setActiveRound(r.key)}>
            {r.short}
          </button>
        ))}
      </div>

      {activeRound === "group" && (
        <div className="group-tabs">
          {GROUP_NAMES.map((g) => (
            <button key={g} className={`group-tab ${activeGroup === g ? "active" : ""}`}
              onClick={() => setActiveGroup(g)}>
              {g}
            </button>
          ))}
        </div>
      )}

      <div className="alltips-table-wrap">
        {visibleMatches.map((match) => {
          const result = results[match.id];
          const matchTips = tipMap[match.id] || {};

          return (
            <div key={match.id} className="alltips-match-block">
              <div className="alltips-match-header">
                <span className="at-teams">{match.home} – {match.away}</span>
                <span className="at-date">{formatDate(match.match_date)} {match.match_time}</span>
                {result && (
                  <span className="at-result">Resultat: <strong>{result.home_goals}–{result.away_goals}</strong></span>
                )}
              </div>
              <div className="alltips-grid">
                {players.map((player) => {
                  const tip = matchTips[player.id];
                  const pts = tip && result
                    ? calcPoints({ home_goals: tip.home, away_goals: tip.away }, result)
                    : null;
                  return (
                    <div key={player.id} className={`at-player-tip ${pts === 2 ? "pts-2" : pts === 1 ? "pts-1" : pts === 0 && result ? "pts-0" : ""}`}>
                      <span className="at-player-name">{player.display_name}</span>
                      <span className="at-player-score">
                        {tip !== undefined ? `${tip.home}–${tip.away}` : "–"}
                      </span>
                      {pts !== null && (
                        <span className="at-pts">{pts === 2 ? "✓✓" : pts === 1 ? "✓" : "✗"}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", { month: "short", day: "numeric", weekday: "short" });
}