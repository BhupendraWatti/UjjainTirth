import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MAX_CONTENT_WIDTH,
  TAB_BAR,
  TABLET_BREAKPOINT,
} from "@/constants/layout";

/**
 * Responsive layout values. Use `contentWidth` (not the raw window width) for
 * any card / grid math so tablets get a centered column instead of stretched
 * cards, and `tabBarSpace` as the bottom padding of scrollables on tab screens.
 */
export function useLayout() {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const isCompact = width < 375;
  const isTablet = width >= TABLET_BREAKPOINT;

  const tabBarHeight =
    (isCompact ? TAB_BAR.heightCompact : TAB_BAR.height) +
    TAB_BAR.paddingTop +
    Math.max(
      insets.bottom,
      isCompact ? TAB_BAR.minBottomPaddingCompact : TAB_BAR.minBottomPadding,
    );

  return {
    windowWidth: width,
    windowHeight: height,
    contentWidth,
    isCompact,
    isTablet,
    /** True when the user has enlarged system text (>= 115%). */
    isLargeText: fontScale >= 1.15,
    fontScale,
    insets,
    tabBarHeight,
    /** Bottom padding that keeps scroll content clear of the floating tab bar. */
    tabBarSpace: tabBarHeight + TAB_BAR.contentGap,
  };
}
