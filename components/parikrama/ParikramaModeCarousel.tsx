import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { ParikramaModeItem } from "@/types/parikrama";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { XStack, YStack } from "tamagui";

interface Props {
  modes: ParikramaModeItem[];
  selectedModeId: number | null;
  onSelectMode: (mode: ParikramaModeItem) => void;
}

const getModeTheming = (modeType: string, title: string) => {
  const combined = `${modeType} ${title}`.toLowerCase();

  if (combined.includes("sampoorna") || combined.includes("full")) {
    return {
      badgeBg: COLORS.sacred,
      badgeText: "#FFFFFF",
      accentColor: COLORS.sacred,
      tagLabel: "COMPLETE CIRCUIT",
    };
  }

  if (combined.includes("ghat")) {
    return {
      badgeBg: COLORS.journey,
      badgeText: "#FFFFFF",
      accentColor: COLORS.journey,
      tagLabel: "GHAT DARSHAN",
    };
  }

  return {
    badgeBg: COLORS.gold,
    badgeText: "#FFFFFF",
    accentColor: COLORS.gold,
    tagLabel: "SEGMENTED YATRA",
  };
};

const ParikramaModeCarousel = ({
  modes,
  selectedModeId,
  onSelectMode,
}: Props) => {
  const { width: screenWidth } = useWindowDimensions();

  // Responsive card sizing for 320px–430px screens
  const cardWidth = Math.min(Math.max(screenWidth * 0.76, 260), 320);
  const snapInterval = cardWidth + 12;

  const handleCardPress = useCallback(
    (mode: ParikramaModeItem) => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      onSelectMode(mode);
    },
    [onSelectMode]
  );

  if (!modes || modes.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.3}>
            Parikrama Modes & Yatras
          </Text>
          <Text style={styles.sectionSubtitle} maxFontSizeMultiplier={1.25}>
            Choose your preferred circumambulation style
          </Text>
        </View>

        <View style={styles.modeCountBadge}>
          <Text style={styles.modeCountText} maxFontSizeMultiplier={1.2}>
            {modes.length} Options
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
      >
        {modes.map((mode) => {
          const isSelected = selectedModeId === mode.id;
          const theme = getModeTheming(mode.mode_type, mode.title);

          return (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.88}
              onPress={() => handleCardPress(mode)}
              style={[
                styles.modeCard,
                { width: cardWidth },
                isSelected ? styles.modeCardActive : styles.modeCardInactive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${mode.title}, ${mode.duration}, ${mode.distance}`}
            >
              {/* Card Image Banner with Depth Overlays */}
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: mode.image }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={250}
                  priority="normal"
                  cachePolicy="memory-disk"
                />

                <LinearGradient
                  colors={["rgba(0,0,0,0.15)", "transparent", "rgba(0,0,0,0.65)"]}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Pilgrimage Tag Badge */}
                <View
                  style={[styles.typeBadge, { backgroundColor: theme.badgeBg }]}
                >
                  <Text style={styles.typeBadgeText} maxFontSizeMultiplier={1.2}>
                    {theme.tagLabel}
                  </Text>
                </View>

                {isSelected && (
                  <View style={styles.selectedCheckBadge}>
                    <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Card Details using Tamagui Stacks */}
              <YStack style={styles.cardBody} gap="$2">
                <Text
                  style={styles.modeTitle}
                  numberOfLines={2}
                  maxFontSizeMultiplier={1.3}
                >
                  {mode.title}
                </Text>

                {/* Adaptive Metadata Pills */}
                <XStack flexWrap="wrap" gap="$1.5">
                  <View style={styles.metaBadge}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color={COLORS.journey}
                    />
                    <Text
                      style={styles.metaText}
                      numberOfLines={1}
                      maxFontSizeMultiplier={1.2}
                    >
                      {mode.duration}
                    </Text>
                  </View>

                  <View style={styles.metaBadge}>
                    <Ionicons
                      name="trail-sign-outline"
                      size={12}
                      color={COLORS.journey}
                    />
                    <Text
                      style={styles.metaText}
                      numberOfLines={1}
                      maxFontSizeMultiplier={1.2}
                    >
                      {mode.distance}
                    </Text>
                  </View>
                </XStack>

                {/* Description */}
                <Text
                  style={styles.modeDescription}
                  numberOfLines={3}
                  maxFontSizeMultiplier={1.25}
                >
                  {mode.short_description}
                </Text>

                {/* Action CTA Row */}
                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.ctaButton,
                      isSelected ? styles.ctaButtonActive : styles.ctaButtonInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ctaText,
                        isSelected ? styles.ctaTextActive : styles.ctaTextInactive,
                      ]}
                      maxFontSizeMultiplier={1.25}
                    >
                      {isSelected ? "Selected Yatra • Tap to View" : "View Itinerary & Enquire"}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={isSelected ? "#FFFFFF" : COLORS.journey}
                    />
                  </View>
                </View>
              </YStack>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(ParikramaModeCarousel);

const styles = StyleSheet.create({
  container: {
    marginBottom: 26,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  modeCountBadge: {
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  modeCountText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  modeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1.5,
    ...SHADOWS.card,
  },
  modeCardActive: {
    borderColor: COLORS.journey,
    boxShadow: "0 4px 12px rgba(11, 110, 127, 0.20)",
  },
  modeCardInactive: {
    borderColor: COLORS.hairline,
  },
  imageBox: {
    width: "100%",
    height: 135,
    backgroundColor: COLORS.bgStone,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  typeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  typeBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  selectedCheckBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.journey,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  cardBody: {
    padding: 14,
  },
  modeTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    lineHeight: 21,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    maxWidth: "100%",
  },
  metaText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.journey,
  },
  modeDescription: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 17,
    marginTop: 2,
    minHeight: 34,
  },
  cardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.xs,
  },
  ctaButtonActive: {
    backgroundColor: COLORS.journey,
  },
  ctaButtonInactive: {
    backgroundColor: COLORS.surfaceMuted,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },
  ctaTextActive: {
    color: "#FFFFFF",
  },
  ctaTextInactive: {
    color: COLORS.journey,
  },
});
