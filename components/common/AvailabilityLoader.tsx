import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { FONTS } from "@/constants/typography";
import Animated, {
  Easing,
  FadeInDown,
  FadeInRight,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";

const LOCAL_FALLBACK_IMAGE = require("@/assets/images/Mahakaleshwar-1.jpeg");

const DEFAULT_FALLBACK_URLS = [
  "https://ujjaintirth.com/wp-content/uploads/2026/03/1.png",
  "https://ujjaintirth.com/wp-content/uploads/2026/03/2.jpeg",
  "https://ujjaintirth.com/wp-content/uploads/2026/03/3.png",
];

const ROTATIONS_BY_COUNT: Record<number, number[]> = {
  1: [0],
  2: [-4, 4],
  3: [-6, 0, 6],
  4: [-7, -2.5, 2.5, 7],
  5: [-8, -4, 0, 4, 8],
};

const TRANSLATE_Y_BY_COUNT: Record<number, number[]> = {
  1: [0],
  2: [1, 1],
  3: [2, 0, 2],
  4: [3, 0, 0, 3],
  5: [4, 1, 0, 1, 4],
};

export interface AvailabilityLoaderProps {
  isLoading: boolean;
  count?: number;
  label: string;
  subtitle?: string;
  images?: string[];
  containerStyle?: ViewStyle;
  onReady?: () => void;
  /** Snappy reveal duration in ms once data loads before triggering onReady (default: 700ms) */
  revealDurationMs?: number;
}

/**
 * Single Card in the fanned stack (Real Loaded Image)
 */
const FannedCard = React.memo(
  ({
    uri,
    index,
    totalCards,
  }: {
    uri: string;
    index: number;
    totalCards: number;
  }) => {
    const [hasError, setHasError] = useState(false);

    const rotation = useMemo(() => {
      const list = ROTATIONS_BY_COUNT[totalCards] || ROTATIONS_BY_COUNT[3];
      return list[index] ?? 0;
    }, [totalCards, index]);

    const translateY = useMemo(() => {
      const list = TRANSLATE_Y_BY_COUNT[totalCards] || TRANSLATE_Y_BY_COUNT[3];
      return list[index] ?? 0;
    }, [totalCards, index]);

    const validUri = uri && typeof uri === "string" && uri.trim().length > 0
      ? uri.trim()
      : DEFAULT_FALLBACK_URLS[index % DEFAULT_FALLBACK_URLS.length];

    const source = hasError ? LOCAL_FALLBACK_IMAGE : { uri: validUri };

    return (
      <Animated.View
        entering={FadeInRight.delay(index * 55)
          .duration(280)
          .springify()
          .damping(14)
          .stiffness(120)}
        style={{
          zIndex: index + 1,
          marginLeft: index === 0 ? 0 : totalCards >= 5 ? -22 : -18,
        }}
      >
        <View
          style={[
            styles.cardWrapper,
            {
              transform: [{ rotate: `${rotation}deg` }, { translateY }],
            },
          ]}
        >
          <Image
            source={source}
            style={styles.cardImage}
            contentFit="cover"
            priority="high"
            cachePolicy="memory-disk"
            transition={200}
            onError={() => setHasError(true)}
          />
        </View>
      </Animated.View>
    );
  }
);
FannedCard.displayName = "FannedCard";

/**
 * Single Skeleton Card in the fanned stack (Pulsing state)
 */
const SkeletonCard = ({
  index,
  totalCards,
  pulseStyle,
}: {
  index: number;
  totalCards: number;
  pulseStyle: any;
}) => {
  const rotation = useMemo(() => {
    const list = ROTATIONS_BY_COUNT[totalCards] || ROTATIONS_BY_COUNT[3];
    return list[index] ?? 0;
  }, [totalCards, index]);

  const translateY = useMemo(() => {
    const list = TRANSLATE_Y_BY_COUNT[totalCards] || TRANSLATE_Y_BY_COUNT[3];
    return list[index] ?? 0;
  }, [totalCards, index]);

  return (
    <Animated.View
      style={[
        pulseStyle,
        {
          zIndex: index + 1,
          marginLeft: index === 0 ? 0 : totalCards >= 5 ? -22 : -18,
        },
      ]}
    >
      <View
        style={[
          styles.skeletonCardWrapper,
          {
            transform: [{ rotate: `${rotation}deg` }, { translateY }],
          },
        ]}
      />
    </Animated.View>
  );
};

export const AvailabilityLoader: React.FC<AvailabilityLoaderProps> = ({
  isLoading,
  count = 0,
  label,
  subtitle,
  images = [],
  containerStyle,
  onReady,
  revealDurationMs = 700,
}) => {
  // Pulse animation for skeleton state
  const pulse = useSharedValue(0.42);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 750, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.42, { duration: 750, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  // Dynamic card count per user rules:
  // - If count >= 10: 5 cards (max 5)
  // - If count > 5 (6–9): 4 cards
  // - If count is 4 or 5: 3 cards
  // - If count is 2 or 3: 2 cards
  // - If count === 1: 1 card
  const activeCardCount = useMemo(() => {
    if (isLoading) return 3; // Default skeleton stack
    if (count >= 10) return 5;
    if (count > 5) return 4;
    if (count >= 4) return 3;
    if (count >= 2) return 2;
    if (count === 1) return 1;
    return 0;
  }, [count, isLoading]);

  // Handle snappy handoff when loading ends
  useEffect(() => {
    if (!isLoading && onReady) {
      const timer = setTimeout(() => {
        onReady();
      }, revealDurationMs);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onReady, revealDurationMs]);

  const displayImages = useMemo(() => {
    const list = images.filter(Boolean);
    if (list.length >= activeCardCount) {
      return list.slice(0, activeCardCount);
    }
    // Pad with fallbacks if needed
    const padded = [...list];
    for (let i = padded.length; i < activeCardCount; i++) {
      padded.push(DEFAULT_FALLBACK_URLS[i % DEFAULT_FALLBACK_URLS.length]);
    }
    return padded;
  }, [images, activeCardCount]);

  return (
    <View style={[styles.outerContainer, containerStyle]}>
      {/* Availability Banner Row */}
      <View style={styles.bannerRow}>
        {/* LEFT COLUMN: Count & Label */}
        <View style={styles.leftColumn}>
          {isLoading ? (
            <Animated.View exiting={FadeOut.duration(180)} style={styles.skeletonTextContainer}>
              <Animated.View style={[styles.skeletonTitleBar, pulseStyle]} />
              <Animated.View style={[styles.skeletonSubBar, pulseStyle]} />
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInDown.duration(320).springify().damping(15)}
              style={styles.revealedTextContainer}
            >
              <View style={styles.countBadgeRow}>
                <Text style={styles.countNumber}>{count}</Text>
                <Text style={styles.labelText}>{label}</Text>
              </View>
              {subtitle ? (
                <Text style={styles.subtitleText} numberOfLines={1}>
                  {subtitle}
                </Text>
              ) : (
                <View style={styles.activeDotRow}>
                  <View style={styles.greenPulseDot} />
                  <Text style={styles.readyText}>Verified & Available</Text>
                </View>
              )}
            </Animated.View>
          )}
        </View>

        {/* RIGHT COLUMN: Fanned Cards */}
        <View style={styles.rightColumn}>
          {isLoading ? (
            <Animated.View exiting={FadeOut.duration(180)} style={styles.stackContainer}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard
                  key={`skel-${idx}`}
                  index={idx}
                  totalCards={3}
                  pulseStyle={pulseStyle}
                />
              ))}
            </Animated.View>
          ) : (
            <View style={styles.stackContainer}>
              {displayImages.map((uri, idx) => (
                <FannedCard
                  key={`card-${idx}-${uri}`}
                  uri={uri}
                  index={idx}
                  totalCards={activeCardCount}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

/**
 * Higher-level Screen Container that shows the AvailabilityLoader during initial fetch,
 * presents the reveal for ~700ms, and smoothly crossfades into the full screen children.
 */
export interface AvailabilityScreenProps extends AvailabilityLoaderProps {
  children: React.ReactNode;
}

export const AvailabilityScreen: React.FC<AvailabilityScreenProps> = ({
  isLoading,
  count,
  label,
  subtitle,
  images,
  children,
  revealDurationMs = 700,
}) => {
  // Always play the short branded reveal on a screen's first mount, even when
  // its data was already warmed during splash/login.
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, revealDurationMs);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, revealDurationMs]);

  // Pre-fetch all passed images into memory-disk cache immediately
  useEffect(() => {
    if (images && images.length > 0) {
      const validUrls = images.filter(
        (img): img is string => Boolean(img && typeof img === "string" && img.trim().length > 0)
      );
      if (validUrls.length > 0) {
        Promise.allSettled(
          validUrls.map((u) => Image.prefetch(u.trim(), "memory-disk"))
        ).catch(() => {});
      }
    }
  }, [images]);

  return (
    <View style={styles.flex1}>
      {/* Background pre-warmed content: mounts and loads cards and images in parallel */}
      <View
        style={[
          styles.flex1,
          { opacity: showContent ? 1 : 0 },
        ]}
        pointerEvents={showContent ? "auto" : "none"}
      >
        {children}
      </View>

      {/* Floating AvailabilityLoader animation overlay during initial fetch & reveal */}
      {!showContent && (
        <Animated.View
          exiting={FadeOut.duration(240)}
          style={[StyleSheet.absoluteFillObject, styles.loadingScreenContainer]}
        >
          <AvailabilityLoader
            isLoading={isLoading}
            count={count}
            label={label}
            subtitle={subtitle}
            images={images}
            revealDurationMs={revealDurationMs}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default AvailabilityLoader;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  outerContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loadingScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    backgroundColor: COLORS.bg,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 12,
  },
  rightColumn: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 90,
  },
  stackContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    paddingRight: 6,
  },

  // Skeleton States
  skeletonTextContainer: {
    gap: 8,
  },
  skeletonTitleBar: {
    height: 22,
    width: 150,
    borderRadius: 8,
    backgroundColor: "#DFD8CA",
  },
  skeletonSubBar: {
    height: 13,
    width: 95,
    borderRadius: 6,
    backgroundColor: "#E7E0D3",
  },
  skeletonCardWrapper: {
    width: 52,
    height: 68,
    borderRadius: 12,
    backgroundColor: "#DDD5C6",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 3,
  },

  // Revealed State
  revealedTextContainer: {
    gap: 4,
  },
  countBadgeRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 6,
  },
  countNumber: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: FONTS.display.semiBold,
  },
  labelText: {
    fontSize: 16,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    letterSpacing: 0.2,
  },
  subtitleText: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  activeDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  greenPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.success,
  },
  readyText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.success,
  },

  // Card Styles
  cardWrapper: {
    width: 52,
    height: 68,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
    backgroundColor: "#F3EDE2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
});
