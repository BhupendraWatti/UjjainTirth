import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Path } from "react-native-svg";

const CTA_BG_COLOR = "#FAF5EB";

/**
 * Matching Asymmetrical Sacred River Wave Mask for Skeleton
 */
const SacredBottomWaveSkeleton = () => {
  return (
    <View style={styles.waveContainer} pointerEvents="none">
      <Svg
        width="100%"
        height={48}
        viewBox="0 0 400 48"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Main Wave Fill */}
        <Path
          d="M 0,22 C 65,22 105,40 155,38 C 215,35 245,10 305,12 C 350,14 380,24 400,24 L 400,48 L 0,48 Z"
          fill={CTA_BG_COLOR}
        />

        {/* Parallel Antique-Gold Accent Curve */}
        <Path
          d="M 0,20 C 65,20 105,38 155,36 C 215,33 245,8 305,10 C 350,12 380,22 400,22"
          stroke="#C99A55"
          strokeWidth={1.3}
          fill="none"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
};

export interface PackageLoadingSkeletonProps {
  count?: number;
  style?: ViewStyle;
}

export default function PackageLoadingSkeleton({
  count = 2,
  style,
}: PackageLoadingSkeletonProps) {
  const shimmer = useSharedValue(0.35);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [shimmer]);

  const animatedShimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  const renderSkeletonCard = (cardIndex: number) => (
    <View key={`skel-card-${cardIndex}`} style={styles.card}>
      {/* Top Image Placeholder Area */}
      <View style={styles.imagePlaceholder}>
        {/* Shimmer backdrop */}
        <Animated.View
          style={[styles.imageBackdrop, animatedShimmerStyle]}
        />

        {/* Top-Right Price Pill Skeleton */}
        <View style={styles.pricePillSkeleton}>
          <Animated.View style={[styles.shimmerBar, { width: 64, height: 18 }, animatedShimmerStyle]} />
        </View>

        {/* Over-Image Content Placeholder */}
        <View style={styles.overImageContent}>
          {/* Duration Block Placeholder */}
          <View style={styles.durationRow}>
            <Animated.View
              style={[styles.shimmerBar, styles.durationBar, animatedShimmerStyle]}
            />
            <Animated.View
              style={[styles.shimmerBar, styles.durationBar, animatedShimmerStyle]}
            />
          </View>

          {/* Title Placeholder (2 bars) */}
          <Animated.View
            style={[styles.shimmerBar, styles.titleBarLong, animatedShimmerStyle]}
          />
          <Animated.View
            style={[styles.shimmerBar, styles.titleBarShort, animatedShimmerStyle]}
          />

          {/* Description Placeholder (2 bars) */}
          <Animated.View
            style={[styles.shimmerBar, styles.descBarFull, animatedShimmerStyle]}
          />
          <Animated.View
            style={[styles.shimmerBar, styles.descBarMed, animatedShimmerStyle]}
          />

          {/* Chips Placeholder */}
          <View style={styles.chipRow}>
            <Animated.View
              style={[styles.chipSkeleton, animatedShimmerStyle]}
            />
            <Animated.View
              style={[styles.chipSkeleton, { width: 78 }, animatedShimmerStyle]}
            />
            <Animated.View
              style={[styles.chipSkeleton, { width: 92 }, animatedShimmerStyle]}
            />
          </View>
        </View>

        {/* Asymmetrical Bottom Curve Mask */}
        <SacredBottomWaveSkeleton />
      </View>

      {/* New Architectural Plinth CTA Zone Skeleton */}
      <View style={styles.plinthContainer}>
        <View style={styles.editorialPathway}>
          <Animated.View
            style={[styles.shimmerBar, { width: 110, height: 10, backgroundColor: "#DFD5C6", marginBottom: 6 }, animatedShimmerStyle]}
          />
          <Animated.View
            style={[styles.shimmerBar, { width: 150, height: 16, backgroundColor: "#D4C9B8", marginBottom: 6 }, animatedShimmerStyle]}
          />
          <Animated.View
            style={[styles.shimmerBar, { width: 180, height: 10, backgroundColor: "#E3DDD2" }, animatedShimmerStyle]}
          />
        </View>

        {/* Archway Portal Skeleton */}
        <Animated.View
          style={[styles.templeArchPortalSkeleton, animatedShimmerStyle]}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: count }).map((_, idx) => renderSkeletonCard(idx))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: CTA_BG_COLOR,
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.08)",
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  imagePlaceholder: {
    position: "relative",
    width: "100%",
    minHeight: 340,
    backgroundColor: "#2E241E",
    justifyContent: "flex-end",
  },

  imageBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#3A2E26",
  },

  pricePillSkeleton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  overImageContent: {
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 42,
    zIndex: 2,
    gap: 8,
  },

  durationRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },

  durationBar: {
    width: 68,
    height: 22,
    borderRadius: 6,
  },

  titleBarLong: {
    width: "82%",
    height: 18,
    borderRadius: 6,
  },

  titleBarShort: {
    width: "55%",
    height: 18,
    borderRadius: 6,
    marginBottom: 4,
  },

  descBarFull: {
    width: "95%",
    height: 12,
    borderRadius: 4,
  },

  descBarMed: {
    width: "75%",
    height: 12,
    borderRadius: 4,
    marginBottom: 4,
  },

  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  chipSkeleton: {
    width: 86,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },

  shimmerBar: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },

  waveContainer: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 48,
    zIndex: 3,
  },

  plinthContainer: {
    backgroundColor: CTA_BG_COLOR,
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(201, 154, 85, 0.15)",
  },

  editorialPathway: {
    flex: 1,
    paddingRight: 14,
  },

  templeArchPortalSkeleton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(235, 92, 73, 0.35)",
    borderWidth: 1.5,
    borderColor: "rgba(247, 216, 161, 0.5)",
  },
});
