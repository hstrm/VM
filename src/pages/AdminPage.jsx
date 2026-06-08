import { useState, useEffect } from "react";
import { groupMatches } from "../data/matches";
import { getResults, saveResult } from "../lib/supabase";

const GROUP_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export default function AdminPage() {
  const [results, setResults] = useState({});
  const [inputs, setInputs] = useState({});
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [activeGroup, setActiveGroup] = useState("A");

  useEffect(() => {
    async function load() {
      const res = await getResults();
      const map = {};
      res.forEach((r) => (map[r.match_id] = r));
      setResults(map);
      const inp = {};
      res.forEach((r) => {
        inp[r.match_id] = { home: r.home_goals, away: r.away_goals };
      });
      setInputs(inp);
    }
    load();
  }, []);

  async function handleSave(match) {
    const inp = inputs[match.id];
    if (inp?.home === "" || inp?.away === "" || inp?.home === undefined) return;
    setSaving((s) => ({ ...s, [match.id]: true }));
    try {
      await saveResult(match.id, Number(inp.home), Number(inp.away));
      setResults((r) => ({
        ...r,
        [match.id]: { match_id: match.id, home_goals: Number(inp.home), away_goals: Number(inp.away) },
      }));
      setSaved((s) => ({ ...s, [match.id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [match.id]: false })), 2000);
    } catch (e) {
      alert("Fel vid sparning: " + e.message);
    }
    setSaving((s) => ({ ...s, [match.id]: false }));
  }

  function setInput(matchId, side, value) {
    const num = value === "" ? "" : Math.max(0, Math.min(99, parseInt(value) || 0));
    setInputs((prev) => ({
      ...prev,
      [matchId]: { ...(prev[matchId] || {}), [side]: num },
    }));
  }

  const groupMatches_ = groupMatches.filter((m) => m.group === activeGroup);
  const completedCount = groupMatches.filter((m) => results[m.id]).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>⚙️ Admin — Mata in resultat</h2>
        <p className="admin-sub">{completedCount} av {groupMatches.length} matcher rapporterade</p>
      </div>

      <div className="group-tabs">
        {GROUP_NAMES.map((g) => {
          const done = groupMatches.filter((m) => m.group === g && results[m.id]).length;
          const total = groupMatches.filter((m) => m.group === g).length;
          return (
            <button
              key={g}
              className={`group-tab ${activeGroup === g ? "active" : ""} ${done === total ? "complete" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              {g}
              <span className="tab-badge">{done}/{total}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-match-list">
        {groupMatches_.map((match) => {
          const inp = inputs[match.id] || { home: "", away: "" };
          const existing = results[match.id];
          return (
            <div key={match.id} className={`admin-card ${existing ? "has-result" : ""}`}>
              <div className="match-meta">
                <span className="match-date">{match.date} {match.time}</span>
                <span className="match-venue">{match.venue}</span>
              </div>
              <div className="admin-row">
                <span className="team home">{match.home}</span>
                <input
                  type="number"
                  className="score-input"
                  value={inp.home}
                  onChange={(e) => setInput(match.id, "home", e.target.value)}
                  min={0} max={99}
                  placeholder="–"
                />
                <span className="score-sep">–</span>
                <input
                  type="number"
                  className="score-input"
                  value={inp.away}
                  onChange={(e) => setInput(match.id, "away", e.target.value)}
                  min={0} max={99}
                  placeholder="–"
                />
                <span className="team away">{match.away}</span>
                <button
                  className={`save-btn ${saved[match.id] ? "saved" : ""}`}
                  onClick={() => handleSave(match)}
                  disabled={saving[match.id]}
                >
                  {saving[match.id] ? "..." : saved[match.id] ? "✓ Sparat!" : "Spara"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
