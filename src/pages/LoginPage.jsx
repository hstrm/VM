import { useState } from "react";
import { getOrCreateUser } from "../lib/supabase";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    try {
      const user = await getOrCreateUser(username);
      const isAdmin = adminMode && adminPass === ADMIN_PASSWORD;
      onLogin({ ...user, isAdmin });
    } catch (err) {
      setError("Något gick fel. Kontrollera din internetanslutning.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="pitch-lines" />
      </div>
      <div className="login-card">
        <div className="login-trophy">🏆</div>
        <h1 className="login-title">VM<span>2026</span> Tipset</h1>
        <p className="login-sub">USA · Canada · Mexico</p>
        <p className="login-desc">
          Skriv in ditt namn för att tippa matcherna och tävla mot familj och vänner!
        </p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Ditt namn</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="T.ex. Johan eller Mamma"
              maxLength={30}
              required
              autoFocus
            />
          </div>

          <div className="admin-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={adminMode}
                onChange={(e) => setAdminMode(e.target.checked)}
              />
              <span>Logga in som admin</span>
            </label>
          </div>

          {adminMode && (
            <div className="input-group">
              <label>Adminlösenord</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Lösenord"
              />
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Laddar..." : "Spela! →"}
          </button>
        </form>

        <div className="login-rules">
          <h3>Poängsystem</h3>
          <div className="rules-grid">
            <div className="rule">
              <span className="pts">2p</span>
              <span>Rätt exakt resultat (t.ex. 2–1)</span>
            </div>
            <div className="rule">
              <span className="pts">1p</span>
              <span>Rätt utgång (vinst/oavgjort)</span>
            </div>
            <div className="rule">
              <span className="pts">0p</span>
              <span>Fel</span>
            </div>
          </div>
          <p className="deadline-note">
            ⏰ Tips låses 11 juni 2026 kl 19:00 (CET)
          </p>
        </div>
      </div>
    </div>
  );
}
