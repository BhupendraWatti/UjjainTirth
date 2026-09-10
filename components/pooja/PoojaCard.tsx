import { PoojaItem } from "@/types/pooja";
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
          <Ionicons name="business" size={12} color="#922C45" />
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
    height: 160,
    backgroundColor: "#EFE8E1",
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
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: "75%",
  },
  templeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#922C45",
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
    borderRadius: 10,
  },
  durationText: {
    fontSize: 11,
    fontWeight: "600",
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
    fontWeight: "800",
    color: "#222222",
    flex: 1,
    letterSpacing: -0.2,
  },
  featuredBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400E",
  },
  purpose: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F4EFEA",
  },
  priceContainer: {
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888888",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: "700",
    color: "#922C45",
  },
  priceAmount: {
    fontSize: 19,
    fontWeight: "800",
    color: "#922C45",
    letterSpacing: -0.3,
  },
  customPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#922C45",
  },
  ctaButton: {
    backgroundColor: "#922C45",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    shadowColor: "#922C45",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
