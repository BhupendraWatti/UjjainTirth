import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { memo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { XStack, YStack } from "tamagui";

interface Props {
  onBack?: () => void;
  showBackButton?: boolean;
}

const HERO_BG_LOCAL = require("@/assets/images/narmada-hero.jpg");

const STATS_DATA = [
  { icon: "water" as const, label: "3,450+ KM", sub: "Sacred Circuit" },
  { icon: "trail-sign" as const, label: "Both Banks", sub: "Uttar & Dakshin" },
  { icon: "calendar" as const, label: "All Modes", sub: "Full & Khand" },
  { icon: "shield-checkmark" as const, label: "Verified", sub: "Ashrams & Stays" },
];

const ParikramaHero = ({ onBack, showBackButton = false }: Props) => {
  const { width } = useWindowDimensions();
  const isNarrowScreen = width < 360;

  const handleBack = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, [onBack]);

  const handleStatPress = useCallback(() => {
    try {
      Haptics.selectionAsync();
    } catch {}
  }, []);

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>
      )}

      {/* Main Luxury Hero Banner Card */}
      <View style={styles.heroCard}>
        {/* Layer 1: Authentic Consecrated River Ghats Photography */}
        <Image
          source={HERO_BG_LOCAL}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          priority="high"
          cachePolicy="memory-disk"
          transition={300}
        />

        {/* Layer 2: Atmospheric Dual-Stop Spiritual Gradient Overlay */}
        <LinearGradient
          colors={[
            "rgba(6, 61, 71, 0.45)",
            "rgba(6, 61, 71, 0.82)",
            "#063D47",
          ]}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Layer 3: Warm Ambient Golden Light Overlay (Ghat Aarti Radiance) */}
        <LinearGradient
          colors={[
            "transparent",
            "rgba(184, 128, 46, 0.15)",
            "rgba(6, 61, 71, 0.65)",
          ]}
          locations={[0, 0.6, 1]}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Banner Content Layout using Tamagui YStack & XStack */}
        <YStack
          style={[
            styles.bannerContent,
            isNarrowScreen && styles.bannerContentNarrow,
          ]}
          gap="$2.5"
        >
          {/* Top Row: Sacred Chant Aura Pill Badge */}
          <XStack alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="$2">
            <View style={styles.sacredChantBadge}>
              <View style={styles.sacredDiyaGlow}>
                <Ionicons name="flame" size={13} color={COLORS.gold} />
              </View>
              <Text
                style={styles.sacredChantText}
                maxFontSizeMultiplier={1.3}
                numberOfLines={1}
              >
                ॥ नर्मदे हर ॥ • NARMADE HAR
              </Text>
            </View>

            <View style={styles.circuitPill}>
              <Text
                style={styles.circuitPillText}
                maxFontSizeMultiplier={1.25}
              >
                Maha Pradakshina
              </Text>
            </View>
          </XStack>

          {/* Hero Titles & Spiritual Typography */}
          <YStack gap="$1.5" marginTop="$1">
            <Text
              style={[styles.bannerMainTitle, isNarrowScreen && styles.bannerMainTitleNarrow]}
              maxFontSizeMultiplier={1.3}
              numberOfLines={2}
            >
              Maa Narmada Parikrama
            </Text>

            <Text
              style={styles.bannerDevotionalQuote}
              maxFontSizeMultiplier={1.3}
              numberOfLines={3}
            >
              The holy circumambulation of Mother Narmada from Amarkantak origin to the Arabian Sea confluence.
            </Text>
          </YStack>

          {/* Scripture Blessing Chip */}
          <View style={styles.scriptureChip}>
            <Ionicons name="sparkles" size={12} color="#FCE4DD" />
            <Text
              style={styles.scriptureText}
              maxFontSizeMultiplier={1.25}
              numberOfLines={1}
            >
              दर्शनात् एव मुक्ति: • Salvation merely by sacred vision
            </Text>
          </View>

          {/* Adaptive River Circuit Stats Bento Grid */}
          <XStack
            style={styles.statsContainer}
            flexWrap="wrap"
            justifyContent="space-between"
            gap="$2"
          >
            {STATS_DATA.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={handleStatPress}
                style={[
                  styles.statBox,
                  isNarrowScreen && styles.statBoxNarrow,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}, ${item.sub}`}
              >
                <View style={styles.statIconCircle}>
                  <Ionicons name={item.icon} size={13} color="#FFFFFF" />
                </View>
                <View style={styles.statTextColumn}>
                  <Text
                    style={styles.statLabel}
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.25}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={styles.statSub}
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.2}
                  >
                    {item.sub}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </XStack>
        </YStack>
      </View>
    </View>
  );
};

export default memo(ParikramaHero);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    ...SHADOWS.subtle,
  },
  heroCard: {
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    ...SHADOWS.elevated,
  },
  bannerContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  bannerContentNarrow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sacredChantBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(6, 61, 71, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(184, 128, 46, 0.55)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  sacredDiyaGlow: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(184, 128, 46, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  sacredChantText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  circuitPill: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  circuitPillText: {
    fontSize: 10,
    fontFamily: FONTS.body.semiBold,
    color: "#E2F4F7",
    letterSpacing: 0.4,
  },
  bannerMainTitle: {
    fontSize: 24,
    fontFamily: FONTS.display.bold,
    color: "#FFFFFF",
    letterSpacing: -0.4,
    lineHeight: 30,
    textShadowColor: "rgba(0, 0, 0, 0.45)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bannerMainTitleNarrow: {
    fontSize: 20,
    lineHeight: 26,
  },
  bannerDevotionalQuote: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.92)",
    lineHeight: 18,
  },
  scriptureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
    marginTop: 2,
    marginBottom: 4,
  },
  scriptureText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  statsContainer: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: RADIUS.sm,
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 7,
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 44, // Generous accessibility touch size
  },
  statBoxNarrow: {
    flexBasis: "100%",
  },
  statIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  statTextColumn: {
    flex: 1,
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  statSub: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.78)",
    marginTop: 1,
  },
});
