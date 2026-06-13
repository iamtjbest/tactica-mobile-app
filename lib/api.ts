// lib/api.ts — Tactica API client (Expo / React Native)
import Constants from "expo-constants";
import { router } from "expo-router";

export const API_BASE: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  "https://your-app.onrender.com";

export interface FormationResult { formation: string; probability: number }
export interface Player { name: string; pos: string; spec_pos: string; minutes: number; g_a: number; fallback?: boolean }
export interface Match { opponent: string; competition: string; scored: number; conceded: number; result: "W" | "D" | "L"; formation: string }
export interface FormResponse { team: string; matches: Match[]; attack: number; defence: number; best_formation: string | null; cached: boolean }
export interface LineupResponse { team_name: string; formation: string; xi: Player[]; count: number }
export interface PredictResponse { best_formation: string; probability: number; my_attack: number; my_defence: number; opp_attack: number; opp_defence: number; all_formations: FormationResult[] }
export interface LiveResponse { match_found: boolean; home_team?: string; away_team?: string; home_score?: number; away_score?: number; minute?: number; competition?: string; status?: string; cached?: boolean; live_count?: number }
export interface SquadPlayer { Name: string; Pos: string; SpecPos: string; Min: number; G_A: number }
export interface SquadResponse { team_name: string; count: number; players: SquadPlayer[]; cached: boolean }
export interface ChatMessage { role: "user" | "assistant"; content: string }
export interface NationsPredictResponse { team: string; opponent: string; my_attack: number; my_defence: number; opp_attack: number; opp_defence: number; best_formation: string; probability: number; all_formations: FormationResult[] }

// Data interface model matching your Matchday Center recent scans
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

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
    if (!res.ok) {
      const e = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(e.detail || `API ${res.status}`);
    }
    return res.json();
  } catch (networkError) {
    console.error("🔴 Network Connection Error Captured:", networkError);
    // REMOVED the router.push("/network-error") that was crashing the app.
    throw networkError;
  }
}

export const api = {
  health: () => apiFetch<{ status: string }>("/api/health"),
  predict: (b: { my_team: string; opp_team: string; my_att?: number; my_def?: number; opp_att?: number; opp_def?: number; familiarity_formation?: string; opp_habit_formation?: string }) =>
    apiFetch<PredictResponse>("/api/predict", { method: "POST", body: JSON.stringify(b) }),
  lineup: (team_name: string, formation: string) =>
    apiFetch<LineupResponse>("/api/lineup", { method: "POST", body: JSON.stringify({ team_name, formation }) }),
  form: (team: string) => apiFetch<FormResponse>(`/api/form?team=${encodeURIComponent(team)}`),
  live: (home: string, away: string) => apiFetch<LiveResponse>(`/api/live?home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}`),
  squad: (team: string) => apiFetch<SquadResponse>(`/api/squad?team=${encodeURIComponent(team)}`),
  chat: (b: { my_team: string; opp_team: string; message: string; history: ChatMessage[]; live_context?: string; squad?: SquadPlayer[] }) =>
    apiFetch<{ reply: string }>("/api/chat", { method: "POST", body: JSON.stringify(b) }),
  nationsPredict: (b: { team_id: number; opp_id: number; team_name?: string; opp_name?: string }) =>
    apiFetch<NationsPredictResponse>("/api/nations/predict", { method: "POST", body: JSON.stringify(b) }),

  // ADD THIS:
  getTeams: async (): Promise<string[]> => {
    try {
      // Use the endpoint that ACTUALLY exists in your backend (nations.py)
      const response = await fetch(`${API_BASE}/api/nations/squads?status=official`);
      const data = await response.json();

      let nationNames: string[] = [];
      // Check if the endpoint successfully sent back the squads
      if (data && Array.isArray(data.squads)) {
        nationNames = data.squads.map((s: any) => s.name || s.team_name || "");
      }

      // Merge your hardcoded clubs with the fetched World Cup countries
      const combinedTeams = [...new Set([...CLUB_TEAMS, ...nationNames])].filter(Boolean);
      return combinedTeams;
    } catch (error) {
      return CLUB_TEAMS; // Fallback safely if backend sleeps
    }
  },
  // Updated squad fetch to ensure backend cache is warm
  warmSquad: async (team: string) => {
    return fetch(`${API_BASE}/api/squad?team=${encodeURIComponent(team)}`);
  },

  // Dynamic match analysis query pathway
  matchDetails: (id: string) => apiFetch<MatchDetailsResponse>(`/api/matches/${id}`),
};



export const WC_2026_NATIONS = [
  { id: 101, name: "USA", flag: "🇺🇸", conf: "CONCACAF" },
  { id: 102, name: "Mexico", flag: "🇲🇽", conf: "CONCACAF" },
  { id: 103, name: "Canada", flag: "🇨🇦", conf: "CONCACAF" },
  { id: 104, name: "Costa Rica", flag: "🇨🇷", conf: "CONCACAF" },
  { id: 105, name: "Honduras", flag: "🇭🇳", conf: "CONCACAF" },
  { id: 106, name: "Panama", flag: "🇵🇦", conf: "CONCACAF" },
  { id: 107, name: "Jamaica", flag: "🇯🇲", conf: "CONCACAF" },
  { id: 108, name: "Guatemala", flag: "🇬🇹", conf: "CONCACAF" },
  { id: 201, name: "Argentina", flag: "🇦🇷", conf: "CONMEBOL" },
  { id: 202, name: "Brazil", flag: "🇧🇷", conf: "CONMEBOL" },
  { id: 203, name: "Uruguay", flag: "🇺🇾", conf: "CONMEBOL" },
  { id: 204, name: "Colombia", flag: "🇨🇴", conf: "CONMEBOL" },
  { id: 205, name: "Ecuador", flag: "🇪🇨", conf: "CONMEBOL" },
  { id: 206, name: "Venezuela", flag: "🇻🇪", conf: "CONMEBOL" },
  { id: 301, name: "France", flag: "🇫🇷", conf: "UEFA" },
  { id: 302, name: "Spain", flag: "🇪🇸", conf: "UEFA" },
  { id: 303, name: "Germany", flag: "🇩🇪", conf: "UEFA" },
  { id: 304, name: "England", flag: "🏴\u200b󠁧\u200b󠁢\u200b󠁥\u200b󠁮\u200b󠁧\u200b󠁿", conf: "UEFA" },
  { id: 305, name: "Portugal", flag: "🇵🇹", conf: "UEFA" },
  { id: 306, name: "Netherlands", flag: "🇳🇱", conf: "UEFA" },
  { id: 307, name: "Belgium", flag: "🇧🇪", conf: "UEFA" },
  { id: 308, name: "Italy", flag: "🇮🇹", conf: "UEFA" },
  { id: 309, name: "Switzerland", flag: "🇨🇭", conf: "UEFA" },
  { id: 310, name: "Denmark", flag: "🇩🇰", conf: "UEFA" },
  { id: 311, name: "Croatia", flag: "🇭🇷", conf: "UEFA" },
  { id: 312, name: "Austria", flag: "🇦🇹", conf: "UEFA" },
  { id: 313, name: "Serbia", flag: "🇷🇸", conf: "UEFA" },
  { id: 314, name: "Scotland", flag: "🏴\u200b󠁧\u200b󠁢\u200b󠁳\u200b󠁣\u200b󠁴\u200b󠁿", conf: "UEFA" },
  { id: 315, name: "Poland", flag: "🇵🇱", conf: "UEFA" },
  { id: 316, name: "Turkey", flag: "🇹🇷", conf: "UEFA" },
  { id: 401, name: "Morocco", flag: "🇲🇦", conf: "CAF" },
  { id: 402, name: "Senegal", flag: "🇸🇳", conf: "CAF" },
  { id: 403, name: "Nigeria", flag: "🇳🇬", conf: "CAF" },
  { id: 404, name: "Cameroon", flag: "🇨🇲", conf: "CAF" },
  { id: 405, name: "Egypt", flag: "🇪🇬", conf: "CAF" },
  { id: 406, name: "South Africa", flag: "🇿🇦", conf: "CAF" },
  { id: 407, name: "Mali", flag: "🇲🇱", conf: "CAF" },
  { id: 408, name: "DR Congo", flag: "🇨🇩", conf: "CAF" },
  { id: 409, name: "Tunisia", flag: "🇹🇳", conf: "CAF" },
  { id: 501, name: "Japan", flag: "🇯🇵", conf: "AFC" },
  { id: 502, name: "South Korea", flag: "🇰🇷", conf: "AFC" },
  { id: 503, name: "Iran", flag: "🇮🇷", conf: "AFC" },
  { id: 504, name: "Australia", flag: "🇦🇺", conf: "AFC" },
  { id: 505, name: "Saudi Arabia", flag: "🇸🇦", conf: "AFC" },
  { id: 506, name: "Uzbekistan", flag: "🇺🇿", conf: "AFC" },
  { id: 507, name: "Jordan", flag: "🇯🇴", conf: "AFC" },
  { id: 508, name: "Iraq", flag: "🇮🇶", conf: "AFC" },
  { id: 601, name: "New Zealand", flag: "🇳🇿", conf: "OFC" },
];
export const WC_NATION_NAMES = new Set(WC_2026_NATIONS.map(n => n.name));
export function isNationalTeam(name: string): boolean { return WC_NATION_NAMES.has(name); }
export function getNation(name: string) { return WC_2026_NATIONS.find(n => n.name === name); }

export const CLUB_TEAMS = [
  "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich", "Leicester", "Liverpool", "Manchester City", "Manchester Utd", "Newcastle", "Nott'm Forest", "Southampton", "Tottenham", "West Ham", "Wolves",
  "Real Madrid", "Barcelona", "Atletico Madrid", "Athletic Club", "Real Sociedad", "Real Betis", "Villarreal", "Valencia", "Sevilla", "Girona", "Osasuna", "Getafe", "Rayo Vallecano", "Mallorca", "Celta Vigo",
  "Bayern Munich", "Borussia Dortmund", "Bayer Leverkusen", "RB Leipzig", "Eintracht Frankfurt", "VfB Stuttgart", "SC Freiburg", "Union Berlin", "Werder Bremen", "Augsburg", "Wolfsburg", "Hoffenheim", "Mainz", "St Pauli",
  "Inter Milan", "AC Milan", "Juventus", "Napoli", "Atalanta", "AS Roma", "Lazio", "Fiorentina", "Bologna", "Torino", "Udinese", "Genoa",
  "Paris Saint-Germain", "Monaco", "Marseille", "Lyon", "Lille", "Lens", "Nice", "Rennes", "Brest",
  "Ajax", "PSV Eindhoven", "Feyenoord", "AZ Alkmaar", "FC Utrecht", "FC Twente",
  "Benfica", "Porto", "Sporting CP", "Braga",
  "Celtic", "Rangers", "Club Brugge", "Anderlecht", "Genk",
  "Galatasaray", "Fenerbahce", "Besiktas", "Trabzonspor",
  "Red Bull Salzburg", "Slavia Prague", "Sparta Prague",
].sort();
export const ALL_TEAMS = [...CLUB_TEAMS, ...WC_2026_NATIONS.map(n => n.name)].sort();