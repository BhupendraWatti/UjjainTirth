import { PoojaItem } from "@/types/pooja";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface Props {
  item: PoojaItem;
  onRequest: (item: PoojaItem) => void;
  style?: ViewStyle;
}

const PoojaCard = ({ item, onRequest, style }: Props) => {
  const handlePress = useCallback(() => {
    onRequest(item);
  }, [item, onRequest]);

  return (
    <View style={[styles.card, style]}>
      {/* Top Banner Image with Sacred Temple Badge */}
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

        {/* Temple Badge */}
        <View style={styles.templeBadge}>
          <Ionicons name="business" size={12} color={COLORS.sacred} />
          <Text style={styles.templeText} numberOfLines={1}>
            {item.temple}
          </Text>
        </View>

        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={12} color="#FFFFFF" />
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          {item.is_featured ? (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>VEDIC</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.purpose} numberOfLines={2}>
          {item.short_purpose}
        </Text>

        {/* Pricing & CTA Footer */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starting Dakshina</Text>
            <View style={styles.priceRow}>
              {item.starting_price ? (
                <>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.priceAmount}>
                    {item.starting_price.toLocaleString("en-IN")}
                  </Text>
                </>
              ) : (
                <Text style={styles.customPrice}>Dakshina as per Vidhi</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Request ${item.title}`}
          >
            <Text style={styles.ctaText}>Book Pooja</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(PoojaCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    height: 160,
    backgroundColor: COLORS.surfaceMuted,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  templeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: "75%",
  },
  templeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  durationBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  durationText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: "#FFFFFF",
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.display.regular,
    color: COLORS.ink,
    flex: 1,
    letterSpacing: -0.2,
  },
  featuredBadge: {
    backgroundColor: COLORS.bgStone,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
  },
  purpose: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
    marginBottom: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  priceContainer: {
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencySymbol: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  priceAmount: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.3,
  },
  customPrice: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    ...SHADOWS.subtle,
  },
  ctaText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
