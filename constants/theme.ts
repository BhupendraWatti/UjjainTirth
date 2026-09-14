import { ViewStyle } from "react-native";
import { COLORS } from "./colors";
import { FONTS, TYPOGRAPHY } from "./typography";

/**
 * Standardized Corner Radii (3-step scale)
 */
export const RADIUS = {
  /** Micro badges, tiny pills */
  xs: 6,
  /** Chips, badges, small pills */
  sm: 12,
  /** Standard cards, input rows, medium buttons */
  md: 16,
  /** Modal sheets, large containers */
  lg: 24,
  /** Full pill radius */
  full: 9999,
} as const;

/**
 * Standardized Warm Shadows (tied to ink tone #2B2420)
 */
export const SHADOWS: Record<string, ViewStyle> = {
  subtle: {
    boxShadow: "0 2px 4px rgba(43, 36, 32, 0.06)",
  },
  card: {
    boxShadow: "0 3px 8px rgba(43, 36, 32, 0.10)",
  },
  elevated: {
    boxShadow: "0 6px 14px rgba(43, 36, 32, 0.14)",
  },
};

export const BORDERS = {
  hairline: {
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
};

export { COLORS, FONTS, TYPOGRAPHY };
