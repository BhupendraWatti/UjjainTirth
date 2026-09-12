import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { Package } from "@/types/product";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G, Line, Path } from "react-native-svg";

interface Props {
  item: Package;
  index?: number;
  onPress: () => void;
  onBook?: () => void;
  style?: ViewStyle;
}

// Warm cream tone matching card CTA zone & app background
const CTA_BG_COLOR = "#FAF5EB";

/**
 * Sanitizes HTML strings from WordPress API (removes <p>, <span>, &amp;, &quot;, etc.)
 */
function sanitizeText(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Parses raw duration strings like "1 Night / 2 Days" or "4 Days / 3 Nights"
 * into padded numeric tokens: { days: "02 Days", nights: "01 Night" }
 */
function parseDuration(raw?: string): {
  daysNumber: string | null;
  daysLabel: string | null;
  nightsNumber: string | null;
  nightsLabel: string | null;
} {
  if (!raw) {
    return { daysNumber: null, daysLabel: null, nightsNumber: null, nightsLabel: null };
  }

  const daysMatch = raw.match(/(\d+)\s*Days?/i);
  const nightsMatch = raw.match(/(\d+)\s*Nights?/i);

  const daysCount = daysMatch ? parseInt(daysMatch[1], 10) : null;
  const nightsCount = nightsMatch ? parseInt(nightsMatch[1], 10) : null;

  return {
    daysNumber: daysCount !== null ? String(daysCount).padStart(2, "0") : null,
    daysLabel: daysCount !== null ? (daysCount === 1 ? "Day" : "Days") : null,
    nightsNumber: nightsCount !== null ? String(nightsCount).padStart(2, "0") : null,
    nightsLabel: nightsCount !== null ? (nightsCount === 1 ? "Night" : "Nights") : null,
  };
}

/**
 * Formats price numbers into Indian localized currency string
 */
function formatIndianPrice(rawPrice?: string): string | null {
  if (!rawPrice) return null;
  const cleaned = rawPrice.replace(/[^0-9.]/g, "");
  if (!cleaned || cleaned === "0") return null;
  const num = parseInt(cleaned, 10);
  if (isNaN(num)) return null;
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Unique Asymmetrical Sacred River Wave Mask
 * Connects the bottom edge of the hero image to the cream CTA area below.
 */
const SacredBottomWave = React.memo(() => {
  return (
    <View style={styles.waveContainer} pointerEvents="none">
      <Svg
        width="100%"
        height={48}
        viewBox="0 0 400 48"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Main Asymmetrical Wave Fill (Cream CTA background) */}
        <Path
          d="M 0,22 C 65,22 105,40 155,38 C 215,35 245,10 305,12 C 350,14 380,24 400,24 L 400,48 L 0,48 Z"
          fill={CTA_BG_COLOR}
        />

        {/* Second Ultra-Thin Parallel Antique-Gold Curve */}
        <Path
          d="M 0,20 C 65,20 105,38 155,36 C 215,33 245,8 305,10 C 350,12 380,22 400,22"
          stroke="#C99A55"
          strokeWidth={1.3}
          fill="none"
          opacity={0.85}
        />

        {/* Fine hairline shimmer accent */}
        <Path
          d="M 120,40 C 180,38 220,16 280,15"
          stroke="#D4A373"
          strokeWidth={0.7}
          strokeDasharray="3 3"
          fill="none"
          opacity={0.45}
        />
      </Svg>
    </View>
  );
});
SacredBottomWave.displayName = "SacredBottomWave";

export default function PackageCard({
  item,
  index = 0,
  onPress,
  onBook,
  style,
}: Props) {
  // Shared values for micro-interaction scaling
  const cardScale = useSharedValue(1);
  const portalScale = useSharedValue(1);

  // Parse duration dynamically from API
  const { daysNumber, daysLabel, nightsNumber, nightsLabel } = useMemo(() => {
    return parseDuration(item.duration || item.package_details?.duration);
  }, [item.duration, item.package_details?.duration]);

  // Clean title & description from API
  const displayTitle = useMemo(() => {
    const rawShort = item.package_details?.short_description;
    const cleanShort = sanitizeText(rawShort);
    if (cleanShort && cleanShort.length > 2) {
      return cleanShort;
    }
    return item.name || "Spiritual Journey";
  }, [item.package_details?.short_description, item.name]);

  const displayDescription = useMemo(() => {
    return sanitizeText(item.description || item.package_details?.package_description);
  }, [item.description, item.package_details?.package_description]);

  // Dynamic Highlights from API only (No emojis, no invented icons)
  const highlights = useMemo(() => {
    const list: string[] = [];
    if (item.package_details?.transport?.trim()) {
      list.push(item.package_details.transport.trim());
    }
    if (item.package_details?.stay_type?.trim()) {
      list.push(item.package_details.stay_type.trim());
    }
    if (item.package_details?.meals?.trim()) {
      list.push(item.package_details.meals.trim());
    }
    return list;
  }, [item.package_details]);

  // Price formatting (only rendered if provided by endpoint)
  const formattedPrice = useMemo(() => {
    return formatIndianPrice(item.price || item.package_details?.price);
  }, [item.price, item.package_details?.price]);

  // Default booking action (phone call to support) if onBook is not provided
  const handleDefaultBooking = async () => {
    if (onBook) {
      onBook();
      return;
    }

    const telUrl = Platform.select({
      ios: `telprompt:${APP_CONFIG.SUPPORT_PHONE}`,
      android: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
      default: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
    });
    try {
      if (await Linking.canOpenURL(telUrl)) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert("Cannot Make Call", "Phone calling is not supported on this device.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong while trying to make the call.");
    }
  };

  const handlePressIn = () => {
    cardScale.value = withTiming(0.985, {
      duration: 140,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    cardScale.value = withSpring(1, { damping: 14, stiffness: 160 });
  };

  const handlePortalPressIn = () => {
    portalScale.value = withTiming(0.92, {
      duration: 120,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePortalPressOut = () => {
    portalScale.value = withSpring(1, { damping: 12, stiffness: 180 });
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const animatedPortalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: portalScale.value }],
  }));

  const hasImage = Boolean(item.image && item.image.trim().length > 0);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 85, 350))
        .duration(500)
        .easing(Easing.out(Easing.cubic))}
      style={[styles.outerWrapper, style]}
    >
      <Animated.View style={[styles.card, animatedCardStyle]}>
        {/* ============================================================ */}
        {/* HERO IMAGE CONTAINER (approx 68% of visual card area)         */}
        {/* ============================================================ */}
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Sacred Journey Package: ${displayTitle}. ${daysNumber ? `${daysNumber} ${daysLabel}` : ""}. Tap to view details.`}
          style={styles.imageContainer}
        >
          {/* Underlying warm shimmer / dark base */}
          <View style={styles.imageBackdropBase} />

          {/* Hero Image or neutral dark sacred background when missing */}
          {hasImage ? (
            <Image
              source={{ uri: item.image }}
              style={styles.heroImage}
              contentFit="cover"
              priority={index < 2 ? "high" : "normal"}
              cachePolicy="memory-disk"
              transition={280}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          ) : (
            <View style={styles.placeholderBackdrop}>
              <LinearGradient
                colors={["#2C2018", "#1C140F", "#100B08"]}
                style={StyleSheet.absoluteFillObject}
              />
              {/* Subtle Sacred Architectural Watermark */}
              <View style={styles.placeholderWatermark}>
                <Svg width={140} height={140} viewBox="0 0 100 100" fill="none">
                  <Circle cx={50} cy={50} r={44} stroke="#C99A55" strokeWidth={0.8} strokeDasharray="3 3" opacity={0.25} />
                  <Path d="M 50 12 L 72 50 L 50 88 L 28 50 Z" stroke="#C99A55" strokeWidth={0.8} opacity={0.22} />
                  <Circle cx={50} cy={50} r={18} stroke="#C99A55" strokeWidth={0.8} opacity={0.28} />
                </Svg>
              </View>
            </View>
          )}

          {/* Dark Transparent Gradient Overlay for Maximum Readability */}
          <LinearGradient
            colors={[
              "rgba(18, 12, 9, 0.15)",
              "rgba(18, 12, 9, 0.45)",
              "rgba(18, 12, 9, 0.88)",
              "rgba(18, 12, 9, 0.96)",
            ]}
            locations={[0, 0.35, 0.72, 1.0]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Optional Dynamic Price Tag in Top-Right (Rendered ONLY if price exists in API) */}
          {formattedPrice ? (
            <View style={styles.priceTag}>
              <Text style={styles.priceCurrency}>₹</Text>
              <Text style={styles.priceValue}>{formattedPrice}</Text>
              <Text style={styles.priceSuffix}>/person</Text>
            </View>
          ) : null}

          {/* ============================================================ */}
          {/* OVER-IMAGE CONTENT AREA                                      */}
          {/* ============================================================ */}
          <View style={styles.overImageContent}>
            {/* Typographic Duration Block on Left */}
            {(daysNumber || nightsNumber) && (
              <View style={styles.durationBlock}>
                {daysNumber && (
                  <View style={styles.durationRow}>
                    <Text style={styles.durationNumber}>{daysNumber}</Text>
                    <Text style={styles.durationUnit}>{daysLabel}</Text>
                  </View>
                )}
                {nightsNumber && (
                  <View style={styles.durationRow}>
                    <Text style={styles.durationNumber}>{nightsNumber}</Text>
                    <Text style={styles.durationUnit}>{nightsLabel}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Package Title / Destination Route */}
            <Text style={styles.packageTitle} numberOfLines={2}>
              {displayTitle}
            </Text>

            {/* Short Description */}
            {displayDescription ? (
              <Text style={styles.packageDescription} numberOfLines={3}>
                {displayDescription}
              </Text>
            ) : null}

            {/* Dynamic Highlights (Soft cream chips, API only, NO emojis) */}
            {highlights.length > 0 && (
              <View style={styles.highlightsRow}>
                {highlights.map((highlight, hIdx) => (
                  <View key={`hl-${hIdx}`} style={styles.highlightChip}>
                    <View style={styles.highlightDot} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ============================================================ */}
          {/* ASYMMETRICAL SPIRITUAL WAVE MASK                            */}
          {/* ============================================================ */}
          <SacredBottomWave />
        </Pressable>

        {/* ============================================================ */}
        {/* NEW UNSEEN CTA ARCHITECTURE: THE SACRED KUND PORTAL PLINTH   */}
        {/* ============================================================ */}
        <View style={styles.plinthContainer}>
          {/* LEFT: Architectural Editorial Pathway (Tap to View Details) */}
          <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Explore full pilgrimage itinerary and sacred route"
            style={styles.editorialPathway}
          >
            {/* Micro Badge with Glowing Diamond Node */}
            <View style={styles.pathwayBadgeRow}>
              <View style={styles.pathwayStarNode}>
                <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
                  <Path d="M 5 0 L 6.2 3.8 L 10 5 L 6.2 6.2 L 5 10 L 3.8 6.2 L 0 5 L 3.8 3.8 Z" fill="#C99A55" />
                </Svg>
              </View>
              <Text style={styles.pathwayBadgeText}>PILGRIMAGE ITINERARY</Text>
            </View>

            {/* Distinctive Editorial Action Title */}
            <Text style={styles.pathwayTitle}>
              Explore Sacred Route
            </Text>

            {/* Waypoint Track with Sacred Diamond Connectors */}
            <View style={styles.waypointTrackRow}>
              <Text style={styles.waypointLabel}>Darshan</Text>
              <View style={styles.waypointDot} />
              <Text style={styles.waypointLabel}>Ghats</Text>
              <View style={styles.waypointDot} />
              <Text style={styles.waypointLabel}>Inclusions</Text>
            </View>
          </Pressable>

          {/* RIGHT: The Sacred Temple Archway Portal (Garbhagriha Mudra Seal) */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleDefaultBooking();
            }}
            onPressIn={handlePortalPressIn}
            onPressOut={handlePortalPressOut}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Book or inquire this sacred pilgrimage"
            style={styles.portalOuterButton}
          >
            <Animated.View style={[styles.templeArchPortal, animatedPortalStyle]}>
              {/* Forward Sacred Direction Arrow */}
              <Svg width={18} height={16} viewBox="0 0 18 14" fill="none" style={{ marginBottom: 2 }}>
                <Path
                  d="M 3 7 L 15 7 M 10 2 L 15 7 L 10 12"
                  stroke="#FFFFFF"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>

              {/* Micro-script Action Label */}
              <Text style={styles.portalLabel}>BOOK</Text>
            </Animated.View>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
  },

  card: {
    backgroundColor: CTA_BG_COLOR,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.08)",
    // Deep warm spiritual shadow
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },

  // -------------------------------------------------------------
  // HERO IMAGE AREA
  // -------------------------------------------------------------
  imageContainer: {
    position: "relative",
    width: "100%",
    minHeight: 350,
    backgroundColor: "#1C1410",
    justifyContent: "flex-end",
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  imageBackdropBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1F1611",
  },

  placeholderBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#201611",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderWatermark: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    opacity: 0.7,
  },

  // Dynamic Price Tag (Top Right)
  priceTag: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "rgba(24, 17, 13, 0.76)",
    borderWidth: 1,
    borderColor: "rgba(201, 154, 85, 0.45)",
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 14,
    gap: 2,
    zIndex: 10,
  },

  priceCurrency: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#E5B869",
  },

  priceValue: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  priceSuffix: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 2,
  },

  // -------------------------------------------------------------
  // OVER-IMAGE CONTENT (Duration, Title, Description, Chips)
  // -------------------------------------------------------------
  overImageContent: {
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 42,
    zIndex: 2,
  },

  durationBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 8,
  },

  durationRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },

  durationNumber: {
    fontSize: 22,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    lineHeight: 26,
    letterSpacing: 0.5,
  },

  durationUnit: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: "#E2C8A2",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  packageTitle: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    lineHeight: 26,
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 4,
  },

  packageDescription: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.88)",
    lineHeight: 18.5,
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  highlightsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },

  highlightChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(250, 246, 238, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(250, 246, 238, 0.28)",
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    gap: 5,
  },

  highlightDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2A645",
  },

  highlightText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: "#FAF6EE",
    letterSpacing: 0.2,
  },

  // -------------------------------------------------------------
  // ASYMMETRICAL BOTTOM WAVE MASK
  // -------------------------------------------------------------
  waveContainer: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 48,
    zIndex: 3,
  },

  // -------------------------------------------------------------
  // REVOLUTIONARY CTA PLINTH: ARCHITECTURAL TEMPLE GATEWAY
  // -------------------------------------------------------------
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

  // Left: Editorial Pathway
  editorialPathway: {
    flex: 1,
    paddingRight: 14,
    justifyContent: "center",
  },

  pathwayBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },

  pathwayStarNode: {
    width: 10,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  pathwayBadgeText: {
    fontSize: 9.5,
    fontFamily: FONTS.body.bold,
    color: "#8C6538",
    letterSpacing: 1.2,
  },

  pathwayTitle: {
    fontSize: 15.5,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: 0.15,
    marginBottom: 4,
  },

  waypointTrackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  waypointLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    letterSpacing: 0.1,
  },

  waypointDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#C99A55",
    opacity: 0.7,
  },

  // Right: Temple Archway Portal Button
  portalOuterButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  templeArchPortal: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: "#F7D8A1",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    // Radiant saffron shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 4,
  },

  portalLabel: {
    fontSize: 8.5,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.8,
    marginTop: 1,
  },
});
