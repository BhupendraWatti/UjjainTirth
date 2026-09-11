import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
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
      <Ionicons name={iconName} size={13} color={COLORS.journey} style={styles.highlightIcon} />
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
          source={{
            uri:
              item.image && typeof item.image === "string" && item.image.trim() !== ""
                ? item.image.trim()
                : "https://ujjaintirth.com/wp-content/uploads/2026/09/Ujjain-sacred-skyline-1.png",
          }}
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
            <Ionicons name="shield-checkmark" size={15} color={COLORS.success} />
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  imageWrapper: {
    width: "100%",
    height: 170,
    backgroundColor: COLORS.bgStone,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
    letterSpacing: 0.3,
  },
  capacityPill: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(43, 36, 32, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  capacityText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
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
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    flex: 1,
    letterSpacing: -0.2,
  },
  recBadge: {
    backgroundColor: COLORS.gold + "1A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.gold + "33",
  },
  recText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
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
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    maxWidth: "100%",
  },
  highlightIcon: {
    marginRight: 4,
  },
  highlightText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.journey,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  featureNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  featureNoteText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  ctaButton: {
    backgroundColor: COLORS.journey,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    ...SHADOWS.subtle,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
