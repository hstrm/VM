import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import TipsPage from "./pages/TipsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AllTipsPage from "./pages/AllTipsPage";
import AdminPage from "./pages/AdminPage";
import { DEADLINE } from "./lib/supabase";
import "./App.css";

const isLocked = new Date() > DEADLINE;

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("tips");

  useEffect(() => {
    const saved = localStorage.getItem("vm_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem("vm_user", JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("vm_user");
    setPage("tips");
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚽</span>
            <span className="logo-text">VM<span className="logo-year">2026</span></span>
            <span className="logo-sub">Tipset</span>
          </div>
          <nav className="nav">
            <button className={`nav-btn ${page === "tips" ? "active" : ""}`} onClick={() => setPage("tips")}>
              Tippa
            </button>
            <button className={`nav-btn ${page === "leaderboard" ? "active" : ""}`} onClick={() => setPage("leaderboard")}>
              Highscore
            </button>
            <button className={`nav-btn ${page === "alltips" ? "active" : ""}`} onClick={() => setPage("alltips")}>
              {isLocked ? "Alla tips" : "🔒 Alla tips"}
            </button>
            {user.isAdmin && (
              <button className={`nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>
                Admin
              </button>
            )}
          </nav>
          <div className="user-area">
            <span className="user-name">👤 {user.display_name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logga ut</button>
          </div>
        </div>
      </header>
      <main className="app-main">
        {page === "tips" && <TipsPage user={user} />}
        {page === "leaderboard" && <LeaderboardPage />}
        {page === "alltips" && <AllTipsPage />}
        {page === "admin" && user.isAdmin && <AdminPage />}
      </main>
    </div>
  );
}
