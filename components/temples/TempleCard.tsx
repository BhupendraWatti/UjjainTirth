import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { formatDistance, LocationStatus } from "@/hooks/useTempleDistances";
import { Temple } from "@/types/temple";

interface TempleCardProps {
  temple: Temple;
  /** Distance in km (null = unknown, undefined = not loaded yet) */
  distance?: number | null;
  /** GPS status to show appropriate fallback text */
  locationStatus?: LocationStatus;
  style?: ViewStyle;
}

const TempleCard = ({ temple, distance, locationStatus, style }: TempleCardProps) => {
  const router = useRouter();

  const image =
    temple?.image && typeof temple.image === "string" && temple.image.trim() !== ""
      ? temple.image.trim()
      : "https://ujjaintirth.com/wp-content/uploads/2026/09/Ujjain-sacred-skyline-1.png";
  const title = temple.title;
  const tag = temple?.acf?.temple_tag?.name || "No Tag";
  const description = temple?.acf?.temple_short_description
    ? temple.acf.temple_short_description.replace(/<[^>]+>/g, "").slice(0, 110)
    : "";

  const handlePress = useCallback(() => {
    if (!temple.slug) return;
    router.push({
      pathname: "/temples/[slug]" as any,
      params: { slug: temple.slug },
    });
  }, [temple.slug, router]);

  const distanceText = formatDistance(distance);

  const renderDistanceBadge = () => {
    if (locationStatus === "denied") {
      return (
        <View style={styles.distanceBadgeOff}>
          <Text style={styles.distanceIconOff}>📍</Text>
          <Text style={styles.distanceTextOff}>GPS off</Text>
        </View>
      );
    }

    if (locationStatus === "loading") {
      return (
        <View style={styles.distanceBadgeLoading}>
          <Text style={styles.distanceIconLoading}>📍</Text>
          <Text style={styles.distanceTextLoading}>...</Text>
        </View>
      );
    }

    if (distanceText) {
      return (
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceIcon}>📍</Text>
          <Text style={styles.distanceText}>{distanceText}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`View ${title} details`}
      style={style}
    >
      <Card style={styles.card}>
        <View style={styles.container}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>

            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <Badge label={tag} />
                {renderDistanceBadge()}
              </View>

              <Text style={styles.viewDetails}>View Details</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default memo(TempleCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },

  container: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  image: {
    width: 90,
    height: 100,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
  },

  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 17,
    fontFamily: FONTS.display.regular,
    color: COLORS.sacred,
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginBottom: 8,
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
    flexWrap: "wrap",
    marginRight: 8,
  },

  // ── Distance Badge (active) ──
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    gap: 3,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },

  distanceIcon: {
    fontSize: 10,
  },

  distanceText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.success,
  },

  // ── Distance Badge (loading) ──
  distanceBadgeLoading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    gap: 3,
  },

  distanceIconLoading: {
    fontSize: 10,
  },

  distanceTextLoading: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkFaint,
  },

  // ── Distance Badge (GPS off) ──
  distanceBadgeOff: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgStone,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    gap: 3,
  },

  distanceIconOff: {
    fontSize: 10,
  },

  distanceTextOff: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },

  viewDetails: {
    color: COLORS.primary,
    fontFamily: FONTS.body.semiBold,
    fontSize: 13,
    flexShrink: 0,
  },
});
