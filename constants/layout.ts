import { ViewStyle } from "react-native";

/**
 * Layout tokens shared by every screen.
 */

/** Widest a content column gets (iPad / large tablets). Phones are never capped. */
export const MAX_CONTENT_WIDTH = 840;

/** Widest a bottom sheet / dialog gets on tablets. */
export const MAX_SHEET_WIDTH = 600;

/** Width at which list screens switch to two columns. */
export const TABLET_BREAKPOINT = 768;

/** Floating tab bar geometry (see components/navigation/AnimatedTabBar.tsx). */
export const TAB_BAR = {
  height: 58,
  heightCompact: 52,
  paddingTop: 4,
  minBottomPadding: 8,
  minBottomPaddingCompact: 6,
  /** Breathing room between the last list item and the bar. */
  contentGap: 20,
} as const;

/** Centers a column on tablets; no effect on phones. */
export const contentColumn: ViewStyle = {
  width: "100%",
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: "center",
};

/** Centers a bottom sheet / dialog on tablets; no effect on phones. */
export const sheetColumn: ViewStyle = {
  width: "100%",
  maxWidth: MAX_SHEET_WIDTH,
  alignSelf: "center",
};

/** Expands small icon buttons to Apple's / Material's 44-48pt minimum touch area. */
export const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 } as const;
