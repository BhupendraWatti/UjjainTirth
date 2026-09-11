import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { NarmadaLocationItem } from "@/types/parikrama";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
}

const getNodeConfig = (locationType: string): NodeStyleConfig => {
  const type = (locationType || "").toLowerCase();

  if (type.includes("origin")) {
    return {
      iconName: "sparkles",
      bgColor: COLORS.bgStone,
      borderColor: COLORS.gold,
      iconColor: COLORS.gold,
      label: "SACRED ORIGIN",
    };
  }

  if (type.includes("ghat")) {
    return {
      iconName: "water",
      bgColor: COLORS.journeyTint,
      borderColor: COLORS.journey,
      iconColor: COLORS.journey,
      label: "SACRED GHAT",
    };
  }

  if (type.includes("important") || type.includes("destination")) {
    return {
      iconName: "business",
      bgColor: COLORS.sacredTint,
      borderColor: COLORS.sacred,
      iconColor: COLORS.sacred,
      label: "JYOTIRLINGA / SANGAM",
    };
  }

  return {
    iconName: "location",
    bgColor: COLORS.bgStone,
    borderColor: COLORS.inkMuted,
    iconColor: COLORS.inkBody,
    label: "NABHI STHAN / STOP",
  };
};

const RiverSpineTimeline = ({ locations, onSelectLocation }: Props) => {
  if (!locations || locations.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sacred River Spine Path</Text>
        <Text style={styles.subtitle}>
          Chronological Parikrama circuit from holy origin to ocean confluence
        </Text>
      </View>

      <View style={styles.timelineWrapper}>
        {locations.map((loc, index) => {
          const isLast = index === locations.length - 1;
          const config = getNodeConfig(loc.location_type);

          return (
            <View key={loc.id} style={styles.timelineRow}>
              {/* Left Column: Spine Indicator & Connector Line */}
              <View style={styles.spineColumn}>
                {/* Custom glowing node pin */}
                <View
                  style={[
                    styles.pinOuter,
                    { borderColor: config.borderColor, backgroundColor: config.bgColor },
                  ]}
                >
                  <Ionicons name={config.iconName} size={15} color={config.iconColor} />
                </View>

                {/* Connecting River Line */}
                {!isLast ? <View style={styles.riverLine} /> : null}
              </View>

              {/* Right Column: Interactive Location Card */}
              <TouchableOpacity
                style={styles.cardContainer}
                activeOpacity={0.85}
                onPress={() => onSelectLocation(loc)}
              >
                <View style={styles.locationCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.typeBadge, { backgroundColor: config.bgColor }]}>
                        <Text style={[styles.typeBadgeText, { color: config.iconColor }]}>
                          {config.label}
                        </Text>
                      </View>
                      <Text style={styles.stageText}>Stage {loc.route_order}</Text>
                    </View>

                    <Text style={styles.locationTitle} numberOfLines={1}>
                      {loc.title}
                    </Text>
                    <Text style={styles.regionText}>📍 {loc.region}</Text>
                  </View>

                  {/* Location Photo */}
                  <Image
                    source={{ uri: loc.image }}
                    style={styles.locationImage}
                    contentFit="cover"
                    transition={200}
                  />

                  {/* Description */}
                  <View style={styles.cardBody}>
                    <Text style={styles.locationDesc} numberOfLines={2}>
                      {loc.short_description}
                    </Text>

                    <View style={styles.footerRow}>
                      <Text style={styles.actionPrompt}>Yatra Details & Stays</Text>
                      <Ionicons name="chevron-forward" size={13} color={COLORS.journey} />
                    </View>
                  </View>
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
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  timelineWrapper: {
    paddingLeft: 4,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    ...SHADOWS.subtle,
  },
  riverLine: {
    width: 3,
    flex: 1,
    backgroundColor: COLORS.journey,
    marginVertical: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
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
    padding: 12,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    letterSpacing: 0.5,
  },
  stageText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkMuted,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 2,
  },
  regionText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  locationImage: {
    width: "100%",
    height: 110,
    backgroundColor: COLORS.bgStone,
  },
  cardBody: {
    padding: 12,
  },
  locationDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 16,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  actionPrompt: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
});
