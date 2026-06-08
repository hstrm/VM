import { useState, useEffect, useCallback } from "react";
import { groupMatches, DEADLINE } from "../data/matches";
import { getUserTips, saveTip, getResults, calcPoints } from "../lib/supabase";

const GROUP_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const isLocked = new Date() > DEADLINE;

function ScoreBadge({ points }) {
  if (points === null) return null;
  const cls = points === 2 ? "badge-gold" : points === 1 ? "badge-silver" : "badge-zero";
  const label = points === 2 ? "✓✓ 2p" : points === 1 ? "✓ 1p" : "✗ 0p";
  return <span className={`score-badge ${cls}`}>{label}</span>;
}

export default function TipsPage({ user }) {
  const [tips, setTips] = useState({});      // matchId -> { home, away }
  const [results, setResults] = useState({}); // matchId -> { home_goals, away_goals }
  const [saving, setSaving] = useState({});
  const [activeGroup, setActiveGroup] = useState("A");
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    async function load() {
      const [userTips, allResults] = await Promise.all([
        getUserTips(user.id),
        getResults(),
      ]);
      const tMap = {};
      userTips.forEach((t) => {
        tMap[t.match_id] = { home: t.home_goals ?? "", away: t.away_goals ?? "" };
      });
      const rMap = {};
      allResults.forEach((r) => {
        rMap[r.match_id] = { home_goals: r.home_goals, away_goals: r.away_goals };
      });
      setTips(tMap);
      setResults(rMap);

      let pts = 0;
      userTips.forEach((t) => {
        pts += calcPoints(t, rMap[t.match_id]);
      });
      setTotalPoints(pts);
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
      try {
        await saveTip(user.id, matchId, Number(t.home), Number(t.away));
      } catch {}
      setSaving((s) => ({ ...s, [matchId]: false }));
    }
  }

  const groupMatches_ = groupMatches.filter((m) => m.group === activeGroup);

  return (
    <div className="tips-page">
      <div className="tips-header">
        <div>
          <h2>Tippa Gruppspelet</h2>
          <p className="tips-subtitle">
            {isLocked
              ? "⏰ Tipsen är låsta – turneringen har börjat!"
              : "Tips låses 11 juni kl 19:00 CET"}
          </p>
        </div>
        <div className="points-summary">
          <span className="pts-label">Dina poäng</span>
          <span className="pts-value">{totalPoints}</span>
        </div>
      </div>

      <div className="group-tabs">
        {GROUP_NAMES.map((g) => {
          const filled = groupMatches.filter(
            (m) => m.group === g && tips[m.id]?.home !== "" && tips[m.id]?.away !== "" && tips[m.id]?.home !== undefined
          ).length;
          const total = groupMatches.filter((m) => m.group === g).length;
          return (
            <button
              key={g}
              className={`group-tab ${activeGroup === g ? "active" : ""} ${filled === total ? "complete" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              {g}
              {filled > 0 && (
                <span className="tab-badge">{filled}/{total}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="match-list">
        {groupMatches_.map((match) => {
          const tip = tips[match.id] || {};
          const result = results[match.id];
          const pts = result && tip.home !== "" && tip.away !== "" && tip.home !== undefined
            ? calcPoints({ home_goals: Number(tip.home), away_goals: Number(tip.away) }, result)
            : null;
          const hasResult = result !== undefined;

          return (
            <div key={match.id} className={`match-card ${hasResult ? "has-result" : ""}`}>
              <div className="match-meta">
                <span className="match-date">{formatDate(match.date)} {match.time}</span>
                <span className="match-venue">{match.venue}</span>
                {saving[match.id] && <span className="saving-dot">💾</span>}
              </div>
              <div className="match-row">
                <span className="team home">{match.home}</span>
                <div className="score-inputs">
                  {isLocked ? (
                    <div className="locked-tip">
                      <span className="locked-score">
                        {tip.home !== undefined && tip.home !== "" ? tip.home : "–"}
                      </span>
                      <span className="score-sep">–</span>
                      <span className="locked-score">
                        {tip.away !== undefined && tip.away !== "" ? tip.away : "–"}
                      </span>
                    </div>
                  ) : (
                    <>
                      <input
                        type="number"
                        className="score-input"
                        value={tip.home ?? ""}
                        onChange={(e) => handleChange(match.id, "home", e.target.value)}
                        min={0} max={99}
                        placeholder="–"
                      />
                      <span className="score-sep">–</span>
                      <input
                        type="number"
                        className="score-input"
                        value={tip.away ?? ""}
                        onChange={(e) => handleChange(match.id, "away", e.target.value)}
                        min={0} max={99}
                        placeholder="–"
                      />
                    </>
                  )}
                </div>
                <span className="team away">{match.away}</span>
              </div>
              {hasResult && (
                <div className="result-row">
                  <span className="result-label">Resultat:</span>
                  <span className="result-score">{result.home_goals}–{result.away_goals}</span>
                  <ScoreBadge points={pts} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", { month: "short", day: "numeric", weekday: "short" });
}
