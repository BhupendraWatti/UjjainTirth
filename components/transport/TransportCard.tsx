import { TransportHighlight, TransportServiceItem } from "@/types/transport";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface Props {
  item: TransportServiceItem;
  onEnquire: (item: TransportServiceItem) => void;
  style?: ViewStyle;
}

const getHighlightIconName = (iconKey: string): keyof typeof Ionicons.glyphMap => {
  const k = (iconKey || "").toLowerCase();
  if (k.includes("access") || k.includes("elder") || k.includes("step")) return "accessibility-outline";
  if (k.includes("seat") || k.includes("people") || k.includes("pass")) return "people-outline";
  if (k.includes("luggage") || k.includes("boot") || k.includes("bag")) return "briefcase-outline";
  if (k.includes("ac") || k.includes("climate") || k.includes("cool")) return "snow-outline";
  if (k.includes("driver") || k.includes("pilot")) return "person-outline";
  if (k.includes("tv") || k.includes("video") || k.includes("music")) return "tv-outline";
  if (k.includes("charg") || k.includes("usb")) return "battery-charging-outline";
  return "checkmark-circle-outline";
};

const HighlightBadge = ({ highlight }: { highlight: TransportHighlight }) => {
  const iconName = getHighlightIconName(highlight.icon);
  return (
    <View style={styles.highlightBadge}>
      <Ionicons name={iconName} size={13} color="#6C5331" style={styles.highlightIcon} />
      <Text style={styles.highlightText} numberOfLines={1}>
        {highlight.label}
      </Text>
    </View>
  );
};

const TransportCard = ({ item, onEnquire, style }: Props) => {
  const handlePress = useCallback(() => {
    onEnquire(item);
  }, [item, onEnquire]);

  return (
    <View style={[styles.card, style]}>
      {/* Top Media Container */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={250}
        />
        {/* Vehicle Type Badge */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{item.vehicle_type}</Text>
        </View>

        {/* Capacity Floating Pill */}
        <View style={styles.capacityPill}>
          <Ionicons name="people" size={13} color="#FFFFFF" />
          <Text style={styles.capacityText}>{item.passenger_capacity} Seats</Text>
        </View>
      </View>

      {/* Body Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.is_recommended ? (
            <View style={styles.recBadge}>
              <Text style={styles.recText}>POPULAR</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.short_description}
        </Text>

        {/* Highlights Row */}
        {item.highlights && item.highlights.length > 0 ? (
          <View style={styles.highlightsContainer}>
            {item.highlights.slice(0, 3).map((hl, index) => (
              <HighlightBadge key={`${hl.label}-${index}`} highlight={hl} />
            ))}
          </View>
        ) : null}

        {/* Action Footer */}
        <View style={styles.footer}>
          <View style={styles.featureNote}>
            <Ionicons name="shield-checkmark" size={15} color="#10B981" />
            <Text style={styles.featureNoteText}>Sanitized & GPS Tracked</Text>
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Enquire about ${item.title}`}
          >
            <Text style={styles.ctaText}>Enquire Now</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(TransportCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  imageWrapper: {
    width: "100%",
    height: 170,
    backgroundColor: "#EAE6DE",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2C2C2C",
    letterSpacing: 0.3,
  },
  capacityPill: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(35, 35, 35, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  capacityText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222222",
    flex: 1,
    letterSpacing: -0.2,
  },
  recBadge: {
    backgroundColor: "#FDF0D5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  recText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B45309",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 12,
  },
  highlightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  highlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F2EA",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    maxWidth: "100%",
  },
  highlightIcon: {
    marginRight: 4,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A3B24",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2EFEB",
  },
  featureNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  featureNoteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  ctaButton: {
    backgroundColor: "#EB5C49",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#EB5C49",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
