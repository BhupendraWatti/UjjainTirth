import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { usePoojas } from "@/hooks/usePooja";
import { PoojaItem } from "@/types/pooja";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const HomePoojaSection = () => {
  const router = useRouter();
  const { data: poojas, isLoading } = usePoojas();
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(280, width * 0.72);

  const handlePoojaPress = useCallback(
    (item: PoojaItem) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push({
        pathname: "/services/pooja-detail",
        params: { id: item.id.toString() },
      });
    },
    [router]
  );

  const handleViewAll = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/(tabs)/puja");
  }, [router]);

  if (isLoading) {
    return null;
  }

  if (!poojas || poojas.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.titleBadgeRow}>
            <Ionicons name="flame" size={16} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>Sacred Vedic Poojas</Text>
          </View>
          <Text style={styles.sectionSub}>
            Authentic Anushthan performed by Ujjain Tirtha Purohits
          </Text>
        </View>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={handleViewAll}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="View all poojas"
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.sacred} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={poojas}
        keyExtractor={(item) => `home-pooja-${item.id}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const displayImage =
            item.image && typeof item.image === "string" && item.image.trim() !== ""
              ? item.image.trim()
              : "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80";

          return (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handlePoojaPress(item)}
              style={[styles.card, { width: cardWidth }]}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.title}`}
            >
              {/* Image & Gradient Scrim */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: displayImage }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={250}
                />
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.35)",
                    "transparent",
                    "rgba(35, 12, 16, 0.88)",
                  ]}
                  locations={[0, 0.4, 1]}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Badge Tag */}
                {item.badge_tag ? (
                  <View style={styles.badgeTag}>
                    <Text style={styles.badgeTagText}>{item.badge_tag}</Text>
                  </View>
                ) : null}

                {/* Temple Pill */}
                <View style={styles.templePill}>
                  <Ionicons name="location" size={11} color="#FFE082" />
                  <Text style={styles.templeText} numberOfLines={1}>
                    {item.temple}
                  </Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color={COLORS.inkMuted} />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                </View>

                {/* Footer / Price Row */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Starting Dakshina</Text>
                    <Text style={styles.priceAmount}>
                      {item.starting_price
                        ? `₹${item.starting_price.toLocaleString("en-IN")}`
                        : "As per Vidhi"}
                    </Text>
                  </View>

                  <View style={styles.ctaPill}>
                    <Text style={styles.ctaPillText}>View Vidhi</Text>
                    <Ionicons name="arrow-forward" size={11} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default memo(HomePoojaSection);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.15)",
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  imageWrapper: {
    height: 125,
    width: "100%",
    position: "relative",
    backgroundColor: COLORS.surfaceMuted,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  badgeTag: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(35, 12, 16, 0.85)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(255, 224, 130, 0.4)",
  },
  badgeTagText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFE082",
    letterSpacing: 0.4,
  },
  templePill: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  templeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    lineHeight: 18,
    height: 36,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    paddingTop: 8,
  },
  priceLabel: {
    fontSize: 9,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  priceAmount: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  ctaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.sacred,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  ctaPillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
