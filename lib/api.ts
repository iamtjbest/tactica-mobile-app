// lib/api.ts — Tactica API client (React Native / Expo)
import Constants from "expo-constants";

const API_BASE: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  "https://your-app.onrender.com";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FormationResult { formation: string; probability: number }

export interface PredictResponse {
  best_formation: string; probability: number;
  my_attack: number; my_defence: number;
  opp_attack: number; opp_defence: number;
  all_formations: FormationResult[];
}

export interface Player {
  name: string; pos: string; spec_pos: string;
  minutes: number; g_a: number; fallback?: boolean;
}

export interface LineupResponse {
  team_name: string; formation: string; xi: Player[]; count: number;
}

export interface Match {
  fixture_id: number; opponent: string; competition: string;
  scored: number; conceded: number;
  result: "W" | "D" | "L"; formation: string;
}

export interface FormResponse {
  team: string; bsd_name: string; matches: Match[];
  attack: number; defence: number;
  best_formation: string | null; cached: boolean;
}

export interface LiveResponse {
  match_found: boolean; home_team?: string; away_team?: string;
  home_score?: number; away_score?: number; minute?: number;
  competition?: string; status?: string; cached?: boolean;
  live_count?: number;
}

export interface SquadPlayer {
  Name: string; Pos: string; SpecPos: string; Min: number; G_A: number;
}

export interface SquadResponse {
  team_name: string; bsd_name: string; count: number;
  players: SquadPlayer[]; cached: boolean;
}

export interface ChatMessage { role: "user" | "assistant"; content: string }
export interface ChatResponse { reply: string }

export interface NationsPredictResponse {
  team: string; opponent: string;
  my_attack: number; my_defence: number;
  opp_attack: number; opp_defence: number;
  best_formation: string; probability: number;
  all_formations: FormationResult[];
  my_squad_count: number; opp_squad_count: number; players_scored: number;
}

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

// ── API methods ───────────────────────────────────────────────────────────────

export const api = {
  health: () => apiFetch<{ status: string }>("/api/health"),

  predict: (body: {
    my_team: string; opp_team: string;
    my_att?: number; my_def?: number; opp_att?: number; opp_def?: number;
    familiarity_formation?: string; opp_habit_formation?: string;
  }) => apiFetch<PredictResponse>("/api/predict", { method:"POST", body:JSON.stringify(body) }),

  lineup: (team_name: string, formation: string) =>
    apiFetch<LineupResponse>("/api/lineup", { method:"POST", body:JSON.stringify({team_name,formation}) }),

  form: (team: string) =>
    apiFetch<FormResponse>(`/api/form?team=${encodeURIComponent(team)}`),

  live: (home: string, away: string) =>
    apiFetch<LiveResponse>(`/api/live?home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}`),

  squad: (team: string) =>
    apiFetch<SquadResponse>(`/api/squad?team=${encodeURIComponent(team)}`),

  chat: (body: {
    my_team: string; opp_team: string; message: string;
    history: ChatMessage[]; live_context?: string; squad?: SquadPlayer[];
  }) => apiFetch<ChatResponse>("/api/chat", { method:"POST", body:JSON.stringify(body) }),

  nationsPredict: (body: {
    team_id: number; opp_id: number; team_name?: string; opp_name?: string;
  }) => apiFetch<NationsPredictResponse>("/api/nations/predict", { method:"POST", body:JSON.stringify(body) }),
};

// ── Static data ───────────────────────────────────────────────────────────────

export const EUROPEAN_TEAMS = [
  "Arsenal","Aston Villa","Bournemouth","Brentford","Brighton","Chelsea",
  "Crystal Palace","Everton","Fulham","Ipswich","Leicester","Liverpool",
  "Manchester City","Manchester Utd","Newcastle","Nott'm Forest","Southampton",
  "Tottenham","West Ham","Wolves",
  "Real Madrid","Barcelona","Atletico Madrid","Athletic Club","Real Sociedad",
  "Real Betis","Villarreal","Valencia","Sevilla","Girona","Osasuna",
  "Bayern Munich","Borussia Dortmund","Bayer Leverkusen","RB Leipzig",
  "Eintracht Frankfurt","VfB Stuttgart","SC Freiburg","Werder Bremen","St Pauli",
  "Inter Milan","AC Milan","Juventus","Napoli","Atalanta","AS Roma",
  "Lazio","Fiorentina","Bologna","Torino",
  "Paris Saint-Germain","Monaco","Marseille","Lyon","Lille","Lens","Nice","Rennes",
  "Ajax","PSV Eindhoven","Feyenoord","AZ Alkmaar",
  "Benfica","Porto","Sporting CP",
  "Celtic","Rangers","Club Brugge","Anderlecht",
  "Galatasaray","Fenerbahce","Besiktas",
].sort();

export const WC_NATIONS = [
  { id:1,  name:"Argentina",   flag:"🇦🇷", group:"D" },
  { id:2,  name:"Belgium",     flag:"🇧🇪", group:"E" },
  { id:3,  name:"Brazil",      flag:"🇧🇷", group:"C" },
  { id:4,  name:"England",     flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", group:"B" },
  { id:5,  name:"France",      flag:"🇫🇷", group:"E" },
  { id:6,  name:"Germany",     flag:"🇩🇪", group:"E" },
  { id:7,  name:"Italy",       flag:"🇮🇹", group:"G" },
  { id:8,  name:"Japan",       flag:"🇯🇵", group:"F" },
  { id:9,  name:"Mexico",      flag:"🇲🇽", group:"B" },
  { id:10, name:"Morocco",     flag:"🇲🇦", group:"A" },
  { id:11, name:"Netherlands", flag:"🇳🇱", group:"F" },
  { id:12, name:"Nigeria",     flag:"🇳🇬", group:"D" },
  { id:13, name:"Portugal",    flag:"🇵🇹", group:"F" },
  { id:14, name:"Senegal",     flag:"🇸🇳", group:"B" },
  { id:15, name:"Spain",       flag:"🇪🇸", group:"A" },
  { id:16, name:"USA",         flag:"🇺🇸", group:"A" },
];