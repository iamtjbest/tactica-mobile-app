// lib/api.ts — Tactica API client (Expo / React Native)
import Constants from "expo-constants";

export const API_BASE: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  "https://tactica-backend-hdbd.onrender.com";

// ── Response Interfaces ───────────────────────────────────────────────────────

export interface FormationResult { formation: string; probability: number }

export interface Player {
  name: string;
  pos: string;
  spec_pos: string;
  minutes: number;
  g_a: number;
  fallback?: boolean;
}

export interface Match {
  opponent: string;
  competition: string;
  scored: number;
  conceded: number;
  result: "W" | "D" | "L";
  formation: string;
}

export interface FormResponse {
  team: string;
  matches: Match[];
  attack: number;
  defence: number;
  best_formation: string | null;
  cached: boolean;
}

export interface LineupResponse {
  team_name: string;
  formation: string;
  xi: Player[];
  count: number;
}

export interface PredictResponse {
  best_formation: string;
  probability: number;
  my_attack: number;
  my_defence: number;
  opp_attack: number;
  opp_defence: number;
  all_formations: FormationResult[];
}

export interface LiveResponse {
  match_found: boolean;
  home_team?: string;
  away_team?: string;
  home_score?: number;
  away_score?: number;
  minute?: number;
  competition?: string;
  status?: string;
  cached?: boolean;
  live_count?: number;
}

export interface SquadPlayer {
  Name: string;
  Pos: string;
  SpecPos: string;
  Min: number;
  G_A: number;
}

export interface SquadResponse {
  team_name: string;
  count: number;
  players: SquadPlayer[];
  cached: boolean;
}

export interface ChatMessage { role: "user" | "assistant"; content: string }

export interface MatchDetailsResponse {
  id: string;
  league: string;
  matchday: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  homeScoreNum: number;
  awayScoreNum: number;
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  passes: { home: number; away: number };
  events: Array<{
    minute: string;
    type: string;
    team: string;
    player: string;
  }>;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(e.detail || `API ${res.status}`);
    }
    return res.json();
  } catch (networkError) {
    console.error("🔴 Network Error:", networkError);
    throw networkError;
  }
}

// ── API Methods ───────────────────────────────────────────────────────────────

export const api = {
  health: () =>
    apiFetch<{ status: string }>("/api/health"),

  // Auto-Tactics: get last 5 form + best formation for a single team
  form: (team: string) =>
    apiFetch<FormResponse>(`/api/form?team=${encodeURIComponent(team)}`),

  // Opponent Analysis: head-to-head prediction
  predict: (b: {
    my_team: string;
    opp_team: string;
    my_att?: number;
    my_def?: number;
    opp_att?: number;
    opp_def?: number;
    familiarity_formation?: string;
    opp_habit_formation?: string;
  }) => apiFetch<PredictResponse>("/api/predict", { method: "POST", body: JSON.stringify(b) }),

  // Lineup builder: ML-powered XI for a team + formation
  lineup: (team_name: string, formation: string) =>
    apiFetch<LineupResponse>("/api/lineup", {
      method: "POST",
      body: JSON.stringify({ team_name, formation }),
    }),

  // Live Simulator: scoreline context for tactical advice
  live: (home: string, away: string) =>
    apiFetch<LiveResponse>(
      `/api/live?home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}`
    ),

  // Squad fetch: pre-warms backend cache before analysis
  squad: (team: string) =>
    apiFetch<SquadResponse>(`/api/squad?team=${encodeURIComponent(team)}`),

  // AI Chat: Gemini tactical assistant
  chat: (b: {
    my_team: string;
    opp_team: string;
    message: string;
    history: ChatMessage[];
    live_context?: string;
    squad?: SquadPlayer[];
  }) => apiFetch<{ reply: string }>("/api/chat", { method: "POST", body: JSON.stringify(b) }),

  // Match details (for Matchday Center recent scans drill-down)
  matchDetails: (id: string) =>
    apiFetch<MatchDetailsResponse>(`/api/matches/${id}`),
};

// ── Team Lists ────────────────────────────────────────────────────────────────

export const CLUB_TEAMS = [
  // Premier League
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
  "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich",
  "Leicester", "Liverpool", "Manchester City", "Manchester Utd",
  "Newcastle", "Nott'm Forest", "Southampton", "Tottenham", "West Ham", "Wolves",
  // La Liga
  "Real Madrid", "Barcelona", "Atletico Madrid", "Athletic Club", "Real Sociedad",
  "Real Betis", "Villarreal", "Valencia", "Sevilla", "Girona",
  "Osasuna", "Getafe", "Rayo Vallecano", "Mallorca", "Celta Vigo",
  // Bundesliga
  "Bayern Munich", "Borussia Dortmund", "Bayer Leverkusen", "RB Leipzig",
  "Eintracht Frankfurt", "VfB Stuttgart", "SC Freiburg", "Union Berlin",
  "Werder Bremen", "Augsburg", "Wolfsburg", "Hoffenheim", "Mainz", "St Pauli",
  // Serie A
  "Inter Milan", "AC Milan", "Juventus", "Napoli", "Atalanta",
  "AS Roma", "Lazio", "Fiorentina", "Bologna", "Torino", "Udinese", "Genoa",
  // Ligue 1
  "Paris Saint-Germain", "Monaco", "Marseille", "Lyon", "Lille",
  "Lens", "Nice", "Rennes", "Brest",
  // Eredivisie
  "Ajax", "PSV Eindhoven", "Feyenoord", "AZ Alkmaar", "FC Utrecht", "FC Twente",
  // Primeira Liga
  "Benfica", "Porto", "Sporting CP", "Braga",
  // Others
  "Celtic", "Rangers", "Club Brugge", "Anderlecht", "Genk",
  "Galatasaray", "Fenerbahce", "Besiktas", "Trabzonspor",
  "Red Bull Salzburg", "Slavia Prague", "Sparta Prague",
].sort();
