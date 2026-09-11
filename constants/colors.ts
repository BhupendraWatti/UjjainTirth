/**
 * UjjainTirth Design System - Color Tokens
 * Unified palette adhering to UjjainTirth Theme Redesign Specification.
 */
export const COLORS = {
  // ── 2.1 Core Brand & Sacred Tokens ─────────────────────────
  /** Brand saffron-red. CTAs, active tabs, prices, primary buttons */
  primary: "#EB5C49",
  /** Pressed/gradient-end state for primary buttons */
  primaryDeep: "#D9432E",
  /** Light backgrounds behind primary content (badges, selected pills) */
  primaryTint: "#FCE4DD",
  /** Deep Kumkum maroon. Devotional moments: temple names, "Jai Shree Mahakal", pooja headers, Jyotirlingas */
  sacred: "#7C1F2B",
  /** Light maroon backgrounds — pooja card headers, sacred badges */
  sacredTint: "#F3E1E1",
  /** Single deep teal. Reserved ONLY for movement: Transport, Narmada Parikrama, route/map elements */
  journey: "#0B6E7F",
  /** Light teal backgrounds for journey-related cards */
  journeyTint: "#DFF0F2",
  /** Temple bronze. Dividers, icons, small decorative accents, badges only */
  gold: "#B8802E",
  /** Status color: verified, available, confirmed */
  success: "#2E7D32",
  /** Status color: form errors, failed states */
  error: "#C0392B",
  /** Official WhatsApp brand green */
  whatsapp: "#25D366",

  // ── 2.2 Neutral / Surface Tokens ───────────────────────────
  /** Universal app background parchment canvas */
  bg: "#F7F2E7",
  /** Slightly deeper parchment for section dividers, inactive chip backgrounds */
  bgStone: "#EEE6D6",
  /** Pure white for cards, modal sheets */
  surface: "#FFFFFF",
  /** Search bars, input fields, recommendation tiles */
  surfaceMuted: "#F3F1EC",
  /** Primary heading text — warm near-black */
  ink: "#2B2420",
  /** Body copy text */
  inkBody: "#4A433C",
  /** Secondary and meta text */
  inkMuted: "#7A7167",
  /** Placeholders, disabled states, chevrons */
  inkFaint: "#A79C8E",
  /** Warm hairline border for all cards and dividers */
  hairline: "rgba(43, 36, 32, 0.08)",

  // ── Warm Shadow Base ──────────────────────────────────────
  shadowWarm: "rgba(43, 36, 32, 0.10)",

  // ── Backward Compatibility Aliases ────────────────────────
  white: "#FFFFFF",
  secondary: "#FCE4DD", // mapped to primaryTint
  textDark: "#2B2420",  // mapped to ink
  textLight: "#7A7167", // mapped to inkMuted
} as const;

export type ColorToken = keyof typeof COLORS;
