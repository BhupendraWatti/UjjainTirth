import { TextStyle } from "react-native";

/**
 * UjjainTirth Design System - Typography Tokens
 * Curated pairing of Fraunces (Display) and Manrope (Body/UI).
 */
export const FONTS = {
  display: {
    regular: "Fraunces-Regular",
    semiBold: "Fraunces-SemiBold",
    bold: "Fraunces-SemiBold",
  },
  body: {
    regular: "Manrope-Regular",
    medium: "Manrope-Medium",
    semiBold: "Manrope-SemiBold",
    bold: "Manrope-Bold",
  },
} as const;

export const TYPOGRAPHY: Record<string, TextStyle> = {
  /** Modal hero titles, big price numbers */
  display: {
    fontFamily: FONTS.display.semiBold,
    fontSize: 30,
    lineHeight: 38,
  },
  /** Screen titles ("Temples in Ujjain") */
  h1: {
    fontFamily: FONTS.display.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  /** Section titles ("Our Services") */
  h2: {
    fontFamily: FONTS.display.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  /** Card titles, pooja/package titles */
  h3: {
    fontFamily: FONTS.display.regular,
    fontSize: 18,
    lineHeight: 24,
  },
  /** Input text, primary CTA labels */
  bodyLarge: {
    fontFamily: FONTS.body.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  /** Standard descriptions, button labels */
  body: {
    fontFamily: FONTS.body.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  /** Card descriptions, filter pills, badges */
  bodySmall: {
    fontFamily: FONTS.body.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  /** Tab labels, meta details */
  caption: {
    fontFamily: FONTS.body.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  /** Distance text, small trust badges */
  micro: {
    fontFamily: FONTS.body.medium,
    fontSize: 11,
    lineHeight: 14,
  },
  /** Category chips, compact grid labels */
  tiny: {
    fontFamily: FONTS.body.semiBold,
    fontSize: 10,
    lineHeight: 14,
  },
};
