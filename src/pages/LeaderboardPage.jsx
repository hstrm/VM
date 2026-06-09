import { useState, useEffect } from "react";
import { getAllTips, getResults, getMatches, buildLeaderboard, ROUNDS } from "../lib/supabase";

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState("all");
  const [availableRounds, setAvailableRounds] = useState([]);

  async function load() {
    setLoading(true);
    const [allTips, results, matches] = await Promise.all([getAllTips(), getResults(), getMatches()]);

    // Figure out which rounds have results
    const resultMatchIds = new Set(results.map((r) => r.match_id));
    const roundsWithResults = new Set(
      matches.filter((m) => resultMatchIds.has(m.id)).map((m) => m.round)
    );
    setAvailableRounds(["all", ...ROUNDS.map((r) => r.key).filter((k) => roundsWithResults.has(k))]);

    const lb = buildLeaderboard(allTips, results, matches);
    setBoard(lb);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Filter board by round
  const filteredBoard = activeRound === "all"
    ? board
    : board
        .map((e) => ({ ...e, total: e.byRound[activeRound] || 0 }))
        .sort((a, b) => b.total - a.total);

  const roundLabel = (key) => {
    if (key === "all") return "Totalt";
    return ROUNDS.find((r) => r.key === key)?.short || key;
  };

  if (loading) return (
    <div className="loading-screen"><div className="loading-ball">⚽</div><p>Laddar highscore...</p></div>
  );

  return (
    <div className="leaderboard-page">
      <div className="lb-header">
        <h2>🏆 Highscore</h2>
        <button className="refresh-btn" onClick={load}>↻ Uppdatera</button>
      </div>

      {availableRounds.length > 1 && (
        <div className="round-tabs" style={{ marginBottom: "20px" }}>
          {availableRounds.map((r) => (
            <button
              key={r}
              className={`round-tab ${activeRound === r ? "active" : ""}`}
              onClick={() => setActiveRound(r)}
            >
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
            <span>Exakt (2p)</span>
            <span>Utgång (1p)</span>
            <span className="lb-total-head">Poäng</span>
          </div>
          {filteredBoard.map((entry, i) => (
            <div key={entry.userId}
              className={`lb-row ${i === 0 ? "first-place" : i === 1 ? "second-place" : i === 2 ? "third-place" : ""}`}
            >
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
  );
}
