import { ViewStyle } from "react-native";
import { COLORS } from "./colors";
import { FONTS, TYPOGRAPHY } from "./typography";

/**
 * Standardized Corner Radii (3-step scale)
 */
export const RADIUS = {
  /** Chips, badges, small pills */
  sm: 12,
  /** Standard cards, input rows, medium buttons */
  md: 16,
  /** Modal sheets, large containers */
  lg: 24,
} as const;

/**
 * Standardized Warm Shadows (tied to ink tone #2B2420)
 */
export const SHADOWS: Record<string, ViewStyle> = {
  subtle: {
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const BORDERS = {
  hairline: {
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
};

export { COLORS, FONTS, TYPOGRAPHY };
