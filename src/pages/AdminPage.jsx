import { useState, useEffect } from "react";
import {
  getMatches, getResults, saveResult,
  addKnockoutMatch, setMatchTippable, deleteMatch,
  ROUNDS, GROUP_NAMES
} from "../lib/supabase";

const KNOCKOUT_ROUNDS = ROUNDS.filter((r) => r.key !== "group");

export default function AdminPage() {
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState({});
  const [inputs, setInputs] = useState({});
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [activeTab, setActiveTab] = useState("results"); // results | knockout
  const [activeGroup, setActiveGroup] = useState("A");
  const [activeRound, setActiveRound] = useState("group");

  // New match form
  const [newMatch, setNewMatch] = useState({ round: "r32", home: "", away: "", date: "", time: "21:00", venue: "" });
  const [adding, setAdding] = useState(false);

  async function loadAll() {
    const [allMatches, allResults] = await Promise.all([getMatches(), getResults()]);
    setMatches(allMatches);
    const rMap = {};
    const iMap = {};
    allResults.forEach((r) => {
      rMap[r.match_id] = r;
      iMap[r.match_id] = { home: r.home_goals, away: r.away_goals };
    });
    setResults(rMap);
    setInputs(iMap);
  }

  useEffect(() => { loadAll(); }, []);

  function setInput(matchId, side, value) {
    const num = value === "" ? "" : Math.max(0, Math.min(99, parseInt(value) || 0));
    setInputs((prev) => ({ ...prev, [matchId]: { ...(prev[matchId] || {}), [side]: num } }));
  }

  async function handleSave(matchId) {
    const inp = inputs[matchId];
    if (inp?.home === "" || inp?.away === "" || inp?.home === undefined) return;
    setSaving((s) => ({ ...s, [matchId]: true }));
    try {
      await saveResult(matchId, Number(inp.home), Number(inp.away));
      setResults((r) => ({ ...r, [matchId]: { match_id: matchId, home_goals: Number(inp.home), away_goals: Number(inp.away) } }));
      setSaved((s) => ({ ...s, [matchId]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [matchId]: false })), 2000);
    } catch (e) { alert("Fel: " + e.message); }
    setSaving((s) => ({ ...s, [matchId]: false }));
  }

  async function handleToggleTippable(matchId, current) {
    await setMatchTippable(matchId, !current);
    setMatches((ms) => ms.map((m) => m.id === matchId ? { ...m, is_tippable: !current } : m));
  }

  async function handleDelete(matchId) {
    if (!confirm("Ta bort den här matchen?")) return;
    await deleteMatch(matchId);
    setMatches((ms) => ms.filter((m) => m.id !== matchId));
  }

  async function handleAddMatch(e) {
    e.preventDefault();
    if (!newMatch.home || !newMatch.away) return;
    setAdding(true);
    try {
      const m = await addKnockoutMatch(
        newMatch.round, newMatch.home, newMatch.away,
        newMatch.date || null, newMatch.time || null, newMatch.venue || null
      );
      setMatches((ms) => [...ms, m]);
      setNewMatch({ round: "r32", home: "", away: "", date: "", time: "21:00", venue: "" });
    } catch (e) { alert("Fel: " + e.message); }
    setAdding(false);
  }

  // Matches to show in results tab
  const visibleMatches = activeRound === "group"
    ? matches.filter((m) => m.round === "group" && m.group_name === activeGroup)
    : matches.filter((m) => m.round === activeRound);

  const completedCount = matches.filter((m) => results[m.id]).length;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>⚙️ Admin</h2>
        <p className="admin-sub">{completedCount} av {matches.length} matcher rapporterade</p>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
          Mata in resultat
        </button>
        <button className={`admin-tab ${activeTab === "knockout" ? "active" : ""}`} onClick={() => setActiveTab("knockout")}>
          Hantera slutspel
        </button>
      </div>

      {/* ======= RESULTS TAB ======= */}
      {activeTab === "results" && (
        <>
          {/* Round selector */}
          <div className="round-tabs" style={{ marginBottom: 12 }}>
            <button className={`round-tab ${activeRound === "group" ? "active" : ""}`} onClick={() => setActiveRound("group")}>Grupp</button>
            {KNOCKOUT_ROUNDS.map((r) => {
              const has = matches.some((m) => m.round === r.key);
              if (!has) return null;
              return (
                <button key={r.key} className={`round-tab ${activeRound === r.key ? "active" : ""}`} onClick={() => setActiveRound(r.key)}>
                  {r.short}
                </button>
              );
            })}
          </div>

          {/* Group tabs */}
          {activeRound === "group" && (
            <div className="group-tabs" style={{ marginBottom: 16 }}>
              {GROUP_NAMES.map((g) => {
                const done = matches.filter((m) => m.round === "group" && m.group_name === g && results[m.id]).length;
                const total = matches.filter((m) => m.round === "group" && m.group_name === g).length;
                return (
                  <button key={g}
                    className={`group-tab ${activeGroup === g ? "active" : ""} ${done === total && total > 0 ? "complete" : ""}`}
                    onClick={() => setActiveGroup(g)}
                  >
                    {g}<span className="tab-badge">{done}/{total}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="admin-match-list">
            {visibleMatches.map((match) => {
              const inp = inputs[match.id] || { home: "", away: "" };
              return (
                <div key={match.id} className={`admin-card ${results[match.id] ? "has-result" : ""}`}>
                  <div className="match-meta">
                    <span className="match-date">{match.match_date} {match.match_time}</span>
                    {match.venue && <span className="match-venue">{match.venue}</span>}
                  </div>
                  <div className="admin-row">
                    <span className="team home">{match.home}</span>
                    <input type="number" className="score-input" value={inp.home}
                      onChange={(e) => setInput(match.id, "home", e.target.value)} min={0} max={99} placeholder="–" />
                    <span className="score-sep">–</span>
                    <input type="number" className="score-input" value={inp.away}
                      onChange={(e) => setInput(match.id, "away", e.target.value)} min={0} max={99} placeholder="–" />
                    <span className="team away">{match.away}</span>
                    <button className={`save-btn ${saved[match.id] ? "saved" : ""}`}
                      onClick={() => handleSave(match.id)} disabled={saving[match.id]}>
                      {saving[match.id] ? "..." : saved[match.id] ? "✓ Sparat!" : "Spara"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ======= KNOCKOUT TAB ======= */}
      {activeTab === "knockout" && (
        <div className="knockout-section">
          {/* Add match form */}
          <div className="add-match-card">
            <h3>Lägg till slutspelsmatch</h3>
            <form onSubmit={handleAddMatch} className="add-match-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Omgång</label>
                  <select value={newMatch.round} onChange={(e) => setNewMatch((n) => ({ ...n, round: e.target.value }))}>
                    {KNOCKOUT_ROUNDS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Datum</label>
                  <input type="date" value={newMatch.date} onChange={(e) => setNewMatch((n) => ({ ...n, date: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Tid</label>
                  <input type="text" value={newMatch.time} placeholder="21:00"
                    onChange={(e) => setNewMatch((n) => ({ ...n, time: e.target.value }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group flex2">
                  <label>Hemmalag</label>
                  <input type="text" value={newMatch.home} placeholder="T.ex. Sverige"
                    onChange={(e) => setNewMatch((n) => ({ ...n, home: e.target.value }))} required />
                </div>
                <div className="input-group flex2">
                  <label>Bortalag</label>
                  <input type="text" value={newMatch.away} placeholder="T.ex. Brasilien"
                    onChange={(e) => setNewMatch((n) => ({ ...n, away: e.target.value }))} required />
                </div>
                <div className="input-group flex2">
                  <label>Arena</label>
                  <input type="text" value={newMatch.venue} placeholder="T.ex. New York"
                    onChange={(e) => setNewMatch((n) => ({ ...n, venue: e.target.value }))} />
                </div>
              </div>
              <button type="submit" className="add-btn" disabled={adding}>
                {adding ? "Lägger till..." : "+ Lägg till match"}
              </button>
            </form>
          </div>

          {/* Existing knockout matches */}
          {KNOCKOUT_ROUNDS.map((r) => {
            const rMatches = matches.filter((m) => m.round === r.key);
            if (rMatches.length === 0) return null;
            return (
              <div key={r.key} className="knockout-round-section">
                <h4 className="round-label">{r.label}</h4>
                {rMatches.map((match) => (
                  <div key={match.id} className={`admin-card ${match.is_tippable ? "tippable" : ""}`}>
                    <div className="match-meta">
                      <span className="match-date">{match.match_date} {match.match_time}</span>
                      {match.venue && <span className="match-venue">{match.venue}</span>}
                    </div>
                    <div className="admin-row">
                      <span className="team-ko">{match.home} vs {match.away}</span>
                      <div className="ko-actions">
                        <button
                          className={`tippable-btn ${match.is_tippable ? "on" : "off"}`}
                          onClick={() => handleToggleTippable(match.id, match.is_tippable)}
                        >
                          {match.is_tippable ? "✓ Tipsning öppen" : "Öppna tipsning"}
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(match.id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
