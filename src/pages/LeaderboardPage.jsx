import { useState, useEffect } from "react";
import { getAllTips, getResults, buildLeaderboard } from "../lib/supabase";

const medals = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    setLoading(true);
    const [allTips, results] = await Promise.all([getAllTips(), getResults()]);
    const lb = buildLeaderboard(allTips, results);
    setBoard(lb);
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-ball">⚽</div>
      <p>Laddar highscore...</p>
    </div>
  );

  return (
    <div className="leaderboard-page">
      <div className="lb-header">
        <h2>🏆 Highscore</h2>
        {lastUpdated && (
          <button className="refresh-btn" onClick={load}>
            ↻ Uppdatera
          </button>
        )}
      </div>

      {board.length === 0 ? (
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
            <span>Rätt utgång (1p)</span>
            <span className="lb-total-head">Totalt</span>
          </div>
          {board.map((entry, i) => (
            <div
              key={entry.userId}
              className={`lb-row ${i === 0 ? "first-place" : i === 1 ? "second-place" : i === 2 ? "third-place" : ""}`}
            >
              <span className="lb-rank">
                {medals[i] || <span className="rank-num">{i + 1}</span>}
              </span>
              <span className="lb-name">{entry.displayName}</span>
              <span className="lb-exact">{entry.exact}</span>
              <span className="lb-outcome">{entry.outcome}</span>
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
