import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaItem } from "@/types/pooja";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
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

const PoojaCard = ({ item, index = 0, onRequest, style }: Props) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.985, { damping: 18, stiffness: 320 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 320 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRequest(item);
  }, [item, onRequest]);

  const displayImage =
    item.image && typeof item.image === "string" && item.image.trim() !== ""
      ? item.image.trim()
      : "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80";

  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(index * 60).springify()}
      style={[styles.container, style]}
    >
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.card, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={`View ritual: ${item.title}`}
      >
        {/* Top Banner Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: displayImage }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />

          {/* Temple Badge */}
          <View style={styles.templeBadge}>
            <Ionicons name="business" size={11} color={COLORS.sacred} />
            <Text style={styles.templeText} numberOfLines={1} maxFontSizeMultiplier={1.2}>
              {item.temple}
            </Text>
          </View>

          {/* Duration Badge */}
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={11} color="#FFFFFF" />
            <Text style={styles.durationText} maxFontSizeMultiplier={1.2}>{item.duration}</Text>
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2} maxFontSizeMultiplier={1.25}>
              {item.title}
            </Text>
            {item.is_featured ? (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredText} maxFontSizeMultiplier={1.2}>VEDIC</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.purpose} numberOfLines={3} maxFontSizeMultiplier={1.25}>
            {item.short_purpose}
          </Text>

          {/* Pricing & CTA Footer */}
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel} maxFontSizeMultiplier={1.2}>Dakshina from</Text>
              <View style={styles.priceRow}>
                {item.starting_price ? (
                  <>
                    <Text style={styles.currencySymbol} maxFontSizeMultiplier={1.2}>₹</Text>
                    <Text style={styles.priceAmount} maxFontSizeMultiplier={1.25}>
                      {item.starting_price.toLocaleString("en-IN")}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.customPrice} maxFontSizeMultiplier={1.25}>As per Vidhi</Text>
                )}
              </View>
            </View>

            <View style={styles.ctaButton}>
              <Text style={styles.ctaText} maxFontSizeMultiplier={1.2}>Book Pooja</Text>
              <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default memo(PoojaCard);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  imageWrapper: {
    width: "100%",
    height: 155,
    backgroundColor: COLORS.surfaceMuted,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  templeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    maxWidth: "75%",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    ...SHADOWS.subtle,
  },
  templeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(35, 20, 25, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  durationText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: "#FFFFFF",
  },
  content: {
    padding: 14,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    flex: 1,
    lineHeight: 23,
    letterSpacing: -0.2,
  },
  featuredBadge: {
    backgroundColor: COLORS.primaryTint,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
  },
  featuredText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.primaryDeep,
    letterSpacing: 0.8,
  },
  purpose: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  priceContainer: {
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginBottom: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencySymbol: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  priceAmount: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.3,
  },
  customPrice: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    ...SHADOWS.subtle,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
