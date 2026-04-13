import { COLORS } from "@/constants/colors";
import { Package } from "@/types/product";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  item: Package;
  onPress: () => void;
}

// Placeholder image when none provided
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1609766418204-df41e949e4a3?w=800&q=80";

export default function PackageCard({ item, onPress }: Props) {
  const imageUri =
    item.image && item.image.trim() !== "" ? item.image : PLACEHOLDER_IMAGE;

  // package_details might not exist from the list API
  const details = item.package_details;
  const hasDetails = details && Object.keys(details).length > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Gradient overlay on image */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={styles.imageOverlay}
        />

        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationIcon}>🕐</Text>
          <Text style={styles.durationText}>{item.duration?.trim()}</Text>
        </View>

        {/* Price tag on image */}
        <View style={styles.priceTag}>
          <Text style={styles.priceSymbol}>₹</Text>
          <Text style={styles.priceAmount}>{item.price}</Text>
          <Text style={styles.pricePer}>/person</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Title Row */}
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Info chips (only show if package_details available) */}
        {hasDetails && (
          <View style={styles.chipRow}>
            {details?.transport && (
              <View style={styles.chip}>
                <Text style={styles.chipEmoji}>🚗</Text>
                <Text style={styles.chipText}>{details.transport}</Text>
              </View>
            )}
            {details?.stay_type && (
              <View style={styles.chip}>
                <Text style={styles.chipEmoji}>🏨</Text>
                <Text style={styles.chipText}>{details.stay_type}</Text>
              </View>
            )}
            {details?.meals && (
              <View style={styles.chip}>
                <Text style={styles.chipEmoji}>🍽️</Text>
                <Text style={styles.chipText}>{details.meals}</Text>
              </View>
            )}
          </View>
        )}

        {/* Action row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            activeOpacity={0.7}
            onPress={onPress}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Text style={styles.viewDetailsArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.7}
            onPress={() => {
              // Non-functional button
            }}
          >
            <LinearGradient
              colors={[COLORS.primary, "#D94535"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bookButtonGradient}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 14,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Android shadow
    elevation: 5,
  },

  imageContainer: {
    position: "relative",
    height: 180,
    width: "100%",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  durationBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  durationIcon: {
    fontSize: 12,
  },

  durationText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  priceTag: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 2,
  },

  priceSymbol: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
  },

  priceAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
  },

  pricePer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginLeft: 2,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 19,
    marginBottom: 14,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  chipEmoji: {
    fontSize: 12,
  },

  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  viewDetailsButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  viewDetailsArrow: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },

  bookButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  bookButtonGradient: {
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },

  bookButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

// === ORIGINAL COMING SOON CODE (COMMENTED) ===
// import ComingSoon from "@/components/ui/ComingSoon";
// import React from "react";
// import { View } from "react-native";

// export default function PackagesScreen() {
//   return (
//     <View style={{ flex: 1 }}>
//       <ComingSoon title="Packages" />
//     </View>
//   );
// }
