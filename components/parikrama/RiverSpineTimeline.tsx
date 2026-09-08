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
      bgColor: "#FEF3C7",
      borderColor: "#F59E0B",
      iconColor: "#B45309",
      label: "SACRED ORIGIN",
    };
  }

  if (type.includes("ghat")) {
    return {
      iconName: "water",
      bgColor: "#E0F2FE",
      borderColor: "#0284C7",
      iconColor: "#0369A1",
      label: "SACRED GHAT",
    };
  }

  if (type.includes("important") || type.includes("destination")) {
    return {
      iconName: "business",
      bgColor: "#FEE2E2",
      borderColor: "#EF4444",
      iconColor: "#B91C1C",
      label: "JYOTIRLINGA / SANGAM",
    };
  }

  return {
    iconName: "location",
    bgColor: "#F3F4F6",
    borderColor: "#9CA3AF",
    iconColor: "#4B5563",
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
                      <Ionicons name="arrow-forward" size={12} color="#088395" />
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
    fontWeight: "800",
    color: "#222222",
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  riverLine: {
    width: 3,
    flex: 1,
    backgroundColor: "#088395",
    marginVertical: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  stageText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  regionText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  locationImage: {
    width: "100%",
    height: 110,
    backgroundColor: "#E2E8F0",
  },
  cardBody: {
    padding: 12,
  },
  locationDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  actionPrompt: {
    fontSize: 11,
    fontWeight: "700",
    color: "#088395",
  },
});
