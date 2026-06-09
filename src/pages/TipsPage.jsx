import { useState, useEffect } from "react";
import {
  getMatches, getUserTips, saveTip, getResults,
  calcPoints, ROUNDS, GROUP_NAMES, DEADLINE
} from "../lib/supabase";

const isGroupLocked = new Date() > DEADLINE;

function ScoreBadge({ points }) {
  if (points === null) return null;
  const cls = points === 2 ? "badge-gold" : points === 1 ? "badge-silver" : "badge-zero";
  const label = points === 2 ? "✓✓ 2p" : points === 1 ? "✓ 1p" : "✗ 0p";
  return <span className={`score-badge ${cls}`}>{label}</span>;
}

function MatchCard({ match, tip, result, onSave, locked, saving }) {
  const pts = result && tip?.home !== undefined && tip?.home !== ""
    ? calcPoints({ home_goals: Number(tip.home), away_goals: Number(tip.away) }, result)
    : null;

  return (
    <div className={`match-card ${result ? "has-result" : ""}`}>
      <div className="match-meta">
        <span className="match-date">{formatDate(match.match_date)} {match.match_time}</span>
        {match.venue && <span className="match-venue">{match.venue}</span>}
        {saving && <span className="saving-dot">💾</span>}
      </div>
      <div className="match-row">
        <span className="team home">{match.home}</span>
        <div className="score-inputs">
          {locked ? (
            <div className="locked-tip">
              <span className="locked-score">{tip?.home !== undefined && tip?.home !== "" ? tip.home : "–"}</span>
              <span className="score-sep">–</span>
              <span className="locked-score">{tip?.away !== undefined && tip?.away !== "" ? tip.away : "–"}</span>
            </div>
          ) : (
            <>
              <input type="number" className="score-input"
                value={tip?.home ?? ""}
                onChange={(e) => onSave(match.id, "home", e.target.value)}
                min={0} max={99} placeholder="–" />
              <span className="score-sep">–</span>
              <input type="number" className="score-input"
                value={tip?.away ?? ""}
                onChange={(e) => onSave(match.id, "away", e.target.value)}
                min={0} max={99} placeholder="–" />
            </>
          )}
        </div>
        <span className="team away">{match.away}</span>
      </div>
      {result && (
        <div className="result-row">
          <span className="result-label">Resultat:</span>
          <span className="result-score">{result.home_goals}–{result.away_goals}</span>
          <ScoreBadge points={pts} />
        </div>
      )}
    </div>
  );
}

export default function TipsPage({ user }) {
  const [matches, setMatches] = useState([]);
  const [tips, setTips] = useState({});
  const [results, setResults] = useState({});
  const [saving, setSaving] = useState({});
  const [activeRound, setActiveRound] = useState("group");
  const [activeGroup, setActiveGroup] = useState("A");
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allMatches, userTips, allResults] = await Promise.all([
        getMatches(), getUserTips(user.id), getResults(),
      ]);
      setMatches(allMatches);

      const tMap = {};
      userTips.forEach((t) => { tMap[t.match_id] = { home: t.home_goals ?? "", away: t.away_goals ?? "" }; });
      const rMap = {};
      allResults.forEach((r) => { rMap[r.match_id] = r; });
      setTips(tMap);
      setResults(rMap);

      let pts = 0;
      userTips.forEach((t) => { pts += calcPoints(t, rMap[t.match_id]); });
      setTotalPoints(pts);
      setLoading(false);
    }
    load();
  }, [user.id]);

  async function handleChange(matchId, side, value) {
    const num = value === "" ? "" : Math.max(0, Math.min(99, parseInt(value) || 0));
    const updated = { ...tips, [matchId]: { ...(tips[matchId] || {}), [side]: num } };
    setTips(updated);
    const t = updated[matchId];
    if (t?.home !== "" && t?.away !== "" && t?.home !== undefined && t?.away !== undefined) {
      setSaving((s) => ({ ...s, [matchId]: true }));
      try { await saveTip(user.id, matchId, Number(t.home), Number(t.away)); } catch {}
      setSaving((s) => ({ ...s, [matchId]: false }));
    }
  }

  // Available rounds (group always visible; knockout only if is_tippable matches exist)
  const availableRounds = ROUNDS.filter((r) => {
    if (r.key === "group") return true;
    return matches.some((m) => m.round === r.key && m.is_tippable);
  });

  // Matches for current view
  const visibleMatches = activeRound === "group"
    ? matches.filter((m) => m.round === "group" && m.group_name === activeGroup)
    : matches.filter((m) => m.round === activeRound && m.is_tippable);

  if (loading) return (
    <div className="loading-screen"><div className="loading-ball">⚽</div><p>Laddar...</p></div>
  );

  // Deadline for this round
  const isLocked = activeRound === "group" ? isGroupLocked : false; // knockout has no auto-lock

  return (
    <div className="tips-page">
      <div className="tips-header">
        <div>
          <h2>Tippa matcher</h2>
          <p className="tips-subtitle">
            {isGroupLocked ? "⏰ Grupptipsen är låsta" : "Grupptips låses 11 juni kl 19:00 CET"}
          </p>
        </div>
        <div className="points-summary">
          <span className="pts-label">Dina poäng</span>
          <span className="pts-value">{totalPoints}</span>
        </div>
      </div>

      {/* Round selector */}
      <div className="round-tabs">
        {availableRounds.map((r) => (
          <button
            key={r.key}
            className={`round-tab ${activeRound === r.key ? "active" : ""}`}
            onClick={() => setActiveRound(r.key)}
          >
            {r.short}
          </button>
        ))}
      </div>

      {/* Group selector (only for group stage) */}
      {activeRound === "group" && (
        <div className="group-tabs">
          {GROUP_NAMES.map((g) => {
            const gMatches = matches.filter((m) => m.round === "group" && m.group_name === g);
            const filled = gMatches.filter((m) => tips[m.id]?.home !== "" && tips[m.id]?.home !== undefined).length;
            return (
              <button
                key={g}
                className={`group-tab ${activeGroup === g ? "active" : ""} ${filled === gMatches.length && filled > 0 ? "complete" : ""}`}
                onClick={() => setActiveGroup(g)}
              >
                {g}
                {filled > 0 && <span className="tab-badge">{filled}/{gMatches.length}</span>}
              </button>
            );
          })}
        </div>
      )}

      {visibleMatches.length === 0 ? (
        <div className="empty-state">
          <p>Inga matcher öppna för tipsning ännu.</p>
          <p className="empty-sub">Admin öppnar nästa omgång när den är klar.</p>
        </div>
      ) : (
        <div className="match-list">
          {visibleMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              tip={tips[match.id]}
              result={results[match.id]}
              onSave={handleChange}
              locked={isLocked}
              saving={saving[match.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", { month: "short", day: "numeric", weekday: "short" });
}
