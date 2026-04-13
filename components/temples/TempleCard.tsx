import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { formatDistance, LocationStatus } from "@/hooks/useTempleDistances";
import { Temple } from "@/types/temple";

interface TempleCardProps {
  temple: Temple;
  /** Distance in km (null = unknown, undefined = not loaded yet) */
  distance?: number | null;
  /** GPS status to show appropriate fallback text */
  locationStatus?: LocationStatus;
}

const TempleCard = ({ temple, distance, locationStatus }: TempleCardProps) => {
  const router = useRouter();

  const image =
    temple?.image && temple.image.trim() !== ""
      ? temple.image
      : "https://via.placeholder.com/300";
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

              <Text style={styles.viewDetails}>View Details →</Text>
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
    borderRadius: 14,
    backgroundColor: "#eee",
  },

  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B0000",
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: "#555",
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
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },

  distanceIcon: {
    fontSize: 10,
  },

  distanceText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2E7D32",
  },

  // ── Distance Badge (loading) ──
  distanceBadgeLoading: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },

  distanceIconLoading: {
    fontSize: 10,
  },

  distanceTextLoading: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
  },

  // ── Distance Badge (GPS off) ──
  distanceBadgeOff: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },

  distanceIconOff: {
    fontSize: 10,
  },

  distanceTextOff: {
    fontSize: 11,
    fontWeight: "600",
    color: "#E65100",
  },

  viewDetails: {
    color: "#FF6A00",
    fontWeight: "500",
    fontSize: 13,
    flexShrink: 0,
  },
});
