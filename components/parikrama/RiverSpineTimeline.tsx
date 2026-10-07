import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { NarmadaLocationItem } from "@/types/parikrama";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { XStack, YStack } from "tamagui";

interface Props {
  locations: NarmadaLocationItem[];
  onSelectLocation: (loc: NarmadaLocationItem) => void;
}

interface NodeStyleConfig {
  iconName: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  label: string;
  sublabel: string;
}

const getNodeConfig = (locationType: string, title: string): NodeStyleConfig => {
  const type = (locationType || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (type.includes("origin") || t.includes("amarkantak")) {
    return {
      iconName: "sparkles",
      bgColor: "#FEF7E6",
      borderColor: COLORS.gold,
      iconColor: COLORS.gold,
      label: "SACRED ORIGIN",
      sublabel: "Maa Narmada Udgam",
    };
  }

  if (type.includes("ghat") || t.includes("maheshwar")) {
    return {
      iconName: "water",
      bgColor: COLORS.journeyTint,
      borderColor: COLORS.journey,
      iconColor: COLORS.journey,
      label: "SACRED GHATS",
      sublabel: "Holkar Royal Snan",
    };
  }

  if (type.includes("important") || type.includes("destination") || t.includes("omkareshwar") || t.includes("bharuch")) {
    return {
      iconName: "business",
      bgColor: COLORS.sacredTint,
      borderColor: COLORS.sacred,
      iconColor: COLORS.sacred,
      label: "JYOTIRLINGA & SANGAM",
      sublabel: "Divine Pilgrimage",
    };
  }

  return {
    iconName: "compass-outline",
    bgColor: COLORS.bgStone,
    borderColor: COLORS.inkBody,
    iconColor: COLORS.inkBody,
    label: "NABHI STHAN & STOP",
    sublabel: "Sacred Center",
  };
};

const RiverSpineTimeline = ({ locations, onSelectLocation }: Props) => {
  const handleLocationPress = useCallback(
    (loc: NarmadaLocationItem) => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
      onSelectLocation(loc);
    },
    [onSelectLocation]
  );

  if (!locations || locations.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.title} maxFontSizeMultiplier={1.3}>
            Sacred River Spine Circuit
          </Text>
          <View style={styles.totalStopsBadge}>
            <Text style={styles.totalStopsText} maxFontSizeMultiplier={1.2}>
              {locations.length} Sacred Stops
            </Text>
          </View>
        </View>
        <Text style={styles.subtitle} maxFontSizeMultiplier={1.25}>
          Chronological pilgrimage route along holy banks from origin to ocean
        </Text>
      </View>

      {/* Vertical Spine River Flow */}
      <View style={styles.timelineWrapper}>
        {locations.map((loc, index) => {
          const isLast = index === locations.length - 1;
          const config = getNodeConfig(loc.location_type, loc.title);

          return (
            <View key={loc.id} style={styles.timelineRow}>
              {/* Left Column: Flowing River Spine & Glowing Node */}
              <View style={styles.spineColumn}>
                {/* Consecrated Glow Node Pin */}
                <View
                  style={[
                    styles.pinOuter,
                    {
                      borderColor: config.borderColor,
                      backgroundColor: config.bgColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={config.iconName}
                    size={16}
                    color={config.iconColor}
                  />
                </View>

                {/* Connecting River Stream */}
                {!isLast && (
                  <View style={styles.riverStreamWrapper}>
                    <LinearGradient
                      colors={[
                        config.borderColor,
                        COLORS.journey,
                        "rgba(11, 110, 127, 0.4)",
                      ]}
                      style={styles.riverLineGradient}
                    />
                  </View>
                )}
              </View>

              {/* Right Column: Interactive Consecrated Location Card */}
              <TouchableOpacity
                style={styles.cardContainer}
                activeOpacity={0.86}
                onPress={() => handleLocationPress(loc)}
                accessibilityRole="button"
                accessibilityLabel={`${loc.title}, Stage ${loc.route_order}, ${config.label}`}
              >
                <View style={styles.locationCard}>
                  {/* Top Bar with Stage & Consecration Tag */}
                  <View style={styles.cardHeader}>
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap="$1.5"
                      marginBottom="$1.5"
                    >
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: config.bgColor, borderColor: config.borderColor },
                        ]}
                      >
                        <Ionicons
                          name={config.iconName}
                          size={10}
                          color={config.iconColor}
                        />
                        <Text
                          style={[styles.typeBadgeText, { color: config.iconColor }]}
                          maxFontSizeMultiplier={1.2}
                        >
                          {config.label}
                        </Text>
                      </View>

                      <View style={styles.stageChip}>
                        <Text style={styles.stageText} maxFontSizeMultiplier={1.2}>
                          Stage {loc.route_order}
                        </Text>
                      </View>
                    </XStack>

                    <Text
                      style={styles.locationTitle}
                      numberOfLines={2}
                      maxFontSizeMultiplier={1.3}
                    >
                      {loc.title}
                    </Text>

                    <XStack alignItems="center" gap="$1" marginTop="$0.5">
                      <Ionicons name="location-sharp" size={12} color={COLORS.inkMuted} />
                      <Text style={styles.regionText} maxFontSizeMultiplier={1.2}>
                        {loc.region}
                      </Text>
                    </XStack>
                  </View>

                  {/* High Quality Consecrated Image */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: loc.image }}
                      style={styles.locationImage}
                      contentFit="cover"
                      transition={250}
                      cachePolicy="memory-disk"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.45)"]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.imageBadge}>
                      <Text style={styles.imageBadgeText} maxFontSizeMultiplier={1.15}>
                        {config.sublabel}
                      </Text>
                    </View>
                  </View>

                  {/* Card Body & Assistance Prompt */}
                  <YStack style={styles.cardBody} gap="$2">
                    <Text
                      style={styles.locationDesc}
                      numberOfLines={3}
                      maxFontSizeMultiplier={1.25}
                    >
                      {loc.short_description}
                    </Text>

                    <View style={styles.footerRow}>
                      <Text style={styles.actionPrompt} maxFontSizeMultiplier={1.25}>
                        Yatra Stays, Snan & Enquire
                      </Text>
                      <View style={styles.chevronCircle}>
                        <Ionicons
                          name="chevron-forward"
                          size={13}
                          color="#FFFFFF"
                        />
                      </View>
                    </View>
                  </YStack>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default memo(RiverSpineTimeline);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 26,
  },
  header: {
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.3,
    flex: 1,
    paddingRight: 8,
  },
  totalStopsBadge: {
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  totalStopsText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 3,
    lineHeight: 17,
  },
  timelineWrapper: {
    paddingLeft: 2,
  },
  timelineRow: {
    flexDirection: "row",
    position: "relative",
  },
  spineColumn: {
    width: 36,
    alignItems: "center",
  },
  pinOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    ...SHADOWS.subtle,
  },
  riverStreamWrapper: {
    flex: 1,
    width: 4,
    alignItems: "center",
    marginVertical: 4,
  },
  riverLineGradient: {
    width: 3,
    height: "100%",
    borderRadius: 1.5,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 18,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  cardHeader: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    letterSpacing: 0.5,
  },
  stageChip: {
    backgroundColor: COLORS.bgStone,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  stageText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkBody,
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  regionText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  imageContainer: {
    width: "100%",
    height: 125,
    backgroundColor: COLORS.bgStone,
    position: "relative",
  },
  locationImage: {
    width: "100%",
    height: "100%",
  },
  imageBadge: {
    position: "absolute",
    bottom: 8,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  imageBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.body.semiBold,
    color: "#FFFFFF",
  },
  cardBody: {
    padding: 14,
  },
  locationDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  actionPrompt: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
  chevronCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.journey,
    justifyContent: "center",
    alignItems: "center",
  },
});
