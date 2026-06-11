import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ROUNDS = [
  { key: "group",  label: "Gruppspel",        short: "Grupp" },
  { key: "r32",    label: "Sextondelsfinaler", short: "1/32" },
  { key: "r16",    label: "Åttondelsfinaler",  short: "1/16" },
  { key: "qf",     label: "Kvartsfinaler",     short: "Kvart" },
  { key: "sf",     label: "Semifinaler",       short: "Semi" },
  { key: "bronze", label: "Bronsmatch",        short: "Brons" },
  { key: "final",  label: "Final",             short: "Final" },
];

export const GROUP_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export const DEADLINE = new Date("2026-06-12T00:00:00"); // Tillfälligt förlängt till midnatt 12 juni

// --- USERS ---
export async function getOrCreateUser(username) {
  const normalized = username.trim().toLowerCase();
  const { data: existing } = await supabase
    .from("users").select("*").eq("username", normalized).single();
  if (existing) return existing;
  const { data: created, error } = await supabase
    .from("users")
    .insert({ username: normalized, display_name: username.trim() })
    .select().single();
  if (error) throw error;
  return created;
}

// --- MATCHES ---
export async function getMatches() {
  const { data, error } = await supabase
    .from("matches").select("*").order("match_date").order("match_time").order("id");
  if (error) throw error;
  return data || [];
}

export async function addKnockoutMatch(round, home, away, date, time, venue) {
  const { data, error } = await supabase
    .from("matches")
    .insert({ round, home, away, match_date: date, match_time: time, venue, is_tippable: false })
    .select().single();
  if (error) throw error;
  return data;
}

export async function setMatchTippable(matchId, tippable) {
  const { error } = await supabase
    .from("matches").update({ is_tippable: tippable }).eq("id", matchId);
  if (error) throw error;
}

export async function deleteMatch(matchId) {
  const { error } = await supabase.from("matches").delete().eq("id", matchId);
  if (error) throw error;
}

// --- TIPS ---
export async function saveTip(userId, matchId, homeGoals, awayGoals) {
  const { data, error } = await supabase
    .from("tips")
    .upsert(
      { user_id: userId, match_id: matchId, home_goals: homeGoals, away_goals: awayGoals },
      { onConflict: "user_id,match_id" }
    ).select().single();
  if (error) throw error;
  return data;
}

export async function getUserTips(userId) {
  const { data, error } = await supabase.from("tips").select("*").eq("user_id", userId);
  if (error) throw error;
  return data || [];
}

export async function getAllTips() {
  const { data, error } = await supabase
    .from("tips").select("*, users(display_name, username)");
  if (error) throw error;
  return data || [];
}

// --- RESULTS ---
export async function getResults() {
  const { data, error } = await supabase.from("results").select("*");
  if (error) throw error;
  return data || [];
}

export async function saveResult(matchId, homeGoals, awayGoals) {
  const { data, error } = await supabase
    .from("results")
    .upsert(
      { match_id: matchId, home_goals: homeGoals, away_goals: awayGoals },
      { onConflict: "match_id" }
    ).select().single();
  if (error) throw error;
  return data;
}

// --- POÄNGBERÄKNING ---
export function calcPoints(tip, result) {
  if (!result || tip.home_goals === null || tip.away_goals === null) return 0;
  if (tip.home_goals === result.home_goals && tip.away_goals === result.away_goals) return 2;
  const tipOutcome = Math.sign(tip.home_goals - tip.away_goals);
  const resultOutcome = Math.sign(result.home_goals - result.away_goals);
  if (tipOutcome === resultOutcome) return 1;
  return 0;
}

export function buildLeaderboard(allTips, results, matches) {
  const resultMap = {};
  results.forEach((r) => (resultMap[r.match_id] = r));

  // Points per round for breakdown
  const scores = {};
  allTips.forEach((tip) => {
    const key = tip.user_id;
    if (!scores[key]) {
      scores[key] = {
        userId: tip.user_id,
        displayName: tip.users?.display_name || tip.users?.username || "?",
        total: 0, exact: 0, outcome: 0,
        byRound: {},
      };
    }
    const pts = calcPoints(tip, resultMap[tip.match_id]);
    scores[key].total += pts;
    if (pts === 2) scores[key].exact++;
    if (pts === 1) scores[key].outcome++;

    // Round breakdown
    const match = matches?.find((m) => m.id === tip.match_id);
    if (match) {
      const r = match.round;
      if (!scores[key].byRound[r]) scores[key].byRound[r] = 0;
      scores[key].byRound[r] += pts;
    }
  });

  return Object.values(scores).sort((a, b) => b.total - a.total);
}