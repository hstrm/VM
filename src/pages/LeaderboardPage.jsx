import { useState, useEffect } from "react";
import { getAllTips, getResults, getMatches, buildLeaderboard, ROUNDS } from "../lib/supabase";

const medals = ["🥇", "🥈", "🥉"];

function RecentResults({ matches, results }) {
  const played = matches
    .filter((m) => results[m.id])
    .sort((a, b) => {
      const da = a.match_date + a.match_time;
      const db = b.match_date + b.match_time;
      return db.localeCompare(da); // senast först
    })
    .slice(0, 20);

  if (played.length === 0) return (
    <div className="recent-empty">
      <p>Inga resultat ännu</p>
    </div>
  );

  return (
    <div className="recent-list">
      {played.map((match) => {
        const r = results[match.id];
        const roundInfo = ROUNDS.find((ro) => ro.key === match.round);
        const isGroup = match.round === "group";
        return (
          <div key={match.id} className="recent-match">
            <div className="recent-meta">
              <span className="recent-round">
                {isGroup ? `Grupp ${match.group_name}` : roundInfo?.short}
              </span>
              <span className="recent-date">{formatDate(match.match_date)}</span>
            </div>
            <div className="recent-row">
              <span className={`recent-team ${r.home_goals > r.away_goals ? "winner" : ""}`}>
                {match.home}
              </span>
              <span className="recent-score">{r.home_goals}–{r.away_goals}</span>
              <span className={`recent-team away ${r.away_goals > r.home_goals ? "winner" : ""}`}>
                {match.away}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState("all");
  const [availableRounds, setAvailableRounds] = useState([]);

  async function load() {
    setLoading(true);
    const [allTips, allResults, allMatches] = await Promise.all([
      getAllTips(), getResults(), getMatches(),
    ]);

    const resultMap = {};
    allResults.forEach((r) => (resultMap[r.match_id] = r));

    const resultMatchIds = new Set(allResults.map((r) => r.match_id));
    const roundsWithResults = new Set(
      allMatches.filter((m) => resultMatchIds.has(m.id)).map((m) => m.round)
    );
    setAvailableRounds(["all", ...ROUNDS.map((r) => r.key).filter((k) => roundsWithResults.has(k))]);

    setMatches(allMatches);
    setResults(resultMap);
    setBoard(buildLeaderboard(allTips, allResults, allMatches));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filteredBoard = activeRound === "all"
    ? board
    : board.map((e) => ({ ...e, total: e.byRound[activeRound] || 0 }))
           .sort((a, b) => b.total - a.total);

  const roundLabel = (key) => {
    if (key === "all") return "Totalt";
    return ROUNDS.find((r) => r.key === key)?.short || key;
  };

  if (loading) return (
    <div className="loading-screen"><div className="loading-ball">⚽</div><p>Laddar...</p></div>
  );

  return (
    <div className="leaderboard-page">
      <div className="lb-header">
        <h2>🏆 Highscore</h2>
        <button className="refresh-btn" onClick={load}>↻ Uppdatera</button>
      </div>

      <div className="lb-layout">
        {/* LEFT: Leaderboard */}
        <div className="lb-left">
          {availableRounds.length > 1 && (
            <div className="round-tabs" style={{ marginBottom: 16 }}>
              {availableRounds.map((r) => (
                <button key={r} className={`round-tab ${activeRound === r ? "active" : ""}`}
                  onClick={() => setActiveRound(r)}>
                  {roundLabel(r)}
                </button>
              ))}
            </div>
          )}

          {filteredBoard.length === 0 ? (
            <div className="empty-state">
              <p>Inga poäng ännu — turneringen har inte börjat!</p>
              <p className="empty-sub">Tips låses 11 juni 2026 kl 19:00 CET</p>
            </div>
          ) : (
            <div className="lb-table">
              <div className="lb-row lb-head">
                <span>#</span>
                <span>Spelare</span>
                <span>Exakt</span>
                <span>Utgång</span>
                <span className="lb-total-head">Poäng</span>
              </div>
              {filteredBoard.map((entry, i) => (
                <div key={entry.userId}
                  className={`lb-row ${i === 0 ? "first-place" : i === 1 ? "second-place" : i === 2 ? "third-place" : ""}`}>
                  <span className="lb-rank">{medals[i] || <span className="rank-num">{i + 1}</span>}</span>
                  <span className="lb-name">{entry.displayName}</span>
                  <span className="lb-exact">{activeRound === "all" ? entry.exact : "–"}</span>
                  <span className="lb-outcome">{activeRound === "all" ? entry.outcome : "–"}</span>
                  <span className="lb-total">{entry.total}</span>
                </div>
              ))}
            </div>
          )}

          <div className="lb-legend">
            <span><strong>2p</strong> = exakt rätt resultat</span>
            <span><strong>1p</strong> = rätt vinnare/oavgjort</span>
          </div>
        </div>

        {/* RIGHT: Recent results */}
        <div className="lb-right">
          <h3 className="recent-title">📋 Senaste resultat</h3>
          <RecentResults matches={matches} results={results} />
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
}
