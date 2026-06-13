// constants/theme.ts — Neon Pitch Unified Design System
// Exact color tokens from Tactica UI HTML screens

export const C = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg: "#0D1317",   // --bg   : main app background
  sur: "#1A242B",   // --sur  : cards, inputs, nav
  sur2: "#223040",   // --sur2 : secondary surfaces, hover states
  // ── Borders ──────────────────────────────────────────────────────────────
  bd: "#2A3B47",   // --bd   : all borders
  // ── Accent ───────────────────────────────────────────────────────────────
  volt: "#CCFF00",   // --volt : primary accent (volt green) - CTAs, active states
  cyan: "#00E5FF",   // --cy   : secondary accent (electric cyan)
  // ── Text ─────────────────────────────────────────────────────────────────
  tx: "#FFFFFF",   // --tx   : primary text (white)
  mt: "#8E9BAE",   // --mt   : muted/secondary text
  // ── Status ───────────────────────────────────────────────────────────────
  red: "#FF4757",   // --red  : danger, loss
  grn: "#00E676",   // --grn  : success, win
  amber: "#FFB830",   // draw, warning
} as const;

// ── Typography System ──────────────────────────────────────────────────────
// Explicitly forces React Native to use asset files instead of native device presets
export const FONT = {
  // Headings & Large Numbers (Playfair Display)
  headingBold: "PlayfairDisplay-Bold",
  headingBlack: "PlayfairDisplay-Black",

  // Standard UI UI Text Elements (DM Sans)
  regular: "DMSans-Regular",
  medium: "DMSans-Medium",
  semiBold: "DMSans-SemiBold",
  bold: "DMSans-Bold",
} as const;

// ── Component Shadows ──────────────────────────────────────────────────────
export const VOLT_SHADOW = {
  shadowColor: "#CCFF00",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.28,
  shadowRadius: 16,
  elevation: 10,
};

export const CARD_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
};

export const TOAST_SHADOW = {
  shadowColor: "#00E5FF",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 8,
};