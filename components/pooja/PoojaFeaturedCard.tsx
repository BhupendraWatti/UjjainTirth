import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaItem } from "@/types/pooja";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  item: PoojaItem;
  index?: number;
  onRequest: (item: PoojaItem) => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PoojaFeaturedCard = ({ item, index = 0, onRequest, style }: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onRequest(item);
  }, [item, onRequest]);

  const displayImage =
    item.image && typeof item.image === "string" && item.image.trim() !== ""
      ? item.image.trim()
      : "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80";

  return (
    <Animated.View
      entering={FadeInDown.duration(450).delay(index * 100).springify()}
      style={[styles.wrapper, style]}
    >
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.card, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={`Featured ritual: ${item.title}`}
      >
        {/* Banner with Sacred Gradient Scrim */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: displayImage }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
          <LinearGradient
            colors={[
              "rgba(0, 0, 0, 0.45)",
              "transparent",
              "rgba(35, 12, 16, 0.85)",
            ]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Top Badges Row */}
          <View style={styles.topRow}>
            <View style={styles.featuredBadge}>
              <Ionicons name="sparkles" size={11} color="#FFE082" />
              <Text style={styles.featuredText}>VEDIC HIGHLIGHT</Text>
            </View>

            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color="#FFFFFF" />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          </View>

          {/* Bottom Title on Image */}
          <View style={styles.overlayContent}>
            <View style={styles.templeRow}>
              <Ionicons name="location" size={13} color="#FFE082" />
              <Text style={styles.templeName} numberOfLines={1}>
                {item.temple}
              </Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.body}>
          <Text style={styles.purpose} numberOfLines={2}>
            {item.short_purpose}
          </Text>

          {/* Pricing & CTA Row */}
          <View style={styles.footer}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Starting Dakshina</Text>
              <View style={styles.priceRow}>
                {item.starting_price ? (
                  <>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.amount}>
                      {item.starting_price.toLocaleString("en-IN")}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.customPrice}>As per Vidhi</Text>
                )}
              </View>
            </View>

            <View style={styles.ctaButton}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDeep]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Book Pooja</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default memo(PoojaFeaturedCard);

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(184, 128, 46, 0.35)", // Subtle gold border
    ...SHADOWS.card,
  },
  imageContainer: {
    width: "100%",
    height: 190,
    position: "relative",
    backgroundColor: COLORS.surfaceMuted,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(43, 15, 20, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 224, 130, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFE082",
    letterSpacing: 0.8,
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  durationText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: "#FFFFFF",
  },
  overlayContent: {
    position: "absolute",
    bottom: 12,
    left: 14,
    right: 14,
    zIndex: 2,
  },
  templeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  templeName: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#FFE082",
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  body: {
    padding: 16,
  },
  purpose: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 19,
    marginBottom: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  priceCol: {
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 15,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  amount: {
    fontSize: 21,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.4,
  },
  customPrice: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  ctaButton: {
    borderRadius: RADIUS.sm,
    overflow: "hidden",
    ...SHADOWS.subtle,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
