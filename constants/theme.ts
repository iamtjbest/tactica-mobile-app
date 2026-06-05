// constants/theme.ts — Tactica design system
export const C = {
  // Backgrounds
  pitch:   "#050d07",
  surface: "#0a1a0c",
  card:    "#0d1f10",
  // Borders
  border:  "#1a4020",
  borderActive: "#22c55e",
  // Greens
  green300: "#86efac",
  green400: "#4ade80",
  green500: "#22c55e",
  green600: "#16a34a",
  green700: "#15803d",
  green800: "#166534",
  green900: "#14532d",
  // Text
  text:    "#e2f0e6",
  muted:   "#6b8f72",
  // Status
  win:     "#22c55e",
  draw:    "#f59e0b",
  loss:    "#ef4444",
  red:     "#ef4444",
  yellow:  "#f59e0b",
} as const;

export const FONT = {
  rajdhani: "Rajdhani" as const,  // loaded via expo-google-fonts or system fallback
  regular:  "System"   as const,
};

// Shared shadow
export const GLOW = {
  shadowColor: "#22c55e",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 8,
};