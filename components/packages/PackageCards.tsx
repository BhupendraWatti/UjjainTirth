import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { Package } from "@/types/product";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  item: Package;
  onPress: () => void;
  style?: ViewStyle;
}

// Placeholder image when none provided
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1609766418204-df41e949e4a3?w=800&q=80";

export default function PackageCard({ item, onPress, style }: Props) {
  const imageUri =
    item.image && item.image.trim() !== "" ? item.image : PLACEHOLDER_IMAGE;

  const handleCall = async () => {
    const telUrl = Platform.select({
      ios: `telprompt:${APP_CONFIG.SUPPORT_PHONE}`,
      android: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
      default: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
    });
    try {
      if (await Linking.canOpenURL(telUrl)) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert("Cannot Make Call", "Phone calling is not supported on this device.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong while trying to make the call.");
    }
  };

  // package_details might not exist from the list API
  const details = item.package_details;
  const hasDetails = details && Object.keys(details).length > 0;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
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
        {/* <View style={styles.priceTag}>
          <Text style={styles.priceSymbol}>₹</Text>
          <Text style={styles.priceAmount}>{item.price}</Text>
          <Text style={styles.pricePer}>/person</Text>
        </View> */}
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
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookButton}
            activeOpacity={0.7}
            onPress={handleCall}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDeep]}
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
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    // Warm shadow
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
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
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
  },

  pricePer: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "rgba(255,255,255,0.85)",
    marginLeft: 2,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontFamily: FONTS.display.regular,
    color: COLORS.ink,
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
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
    backgroundColor: COLORS.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    gap: 4,
  },

  chipEmoji: {
    fontSize: 12,
  },

  chipText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.ink,
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
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  viewDetailsText: {
    fontSize: 14,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.primary,
  },

  viewDetailsArrow: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },

  bookButton: {
    flex: 1,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },

  bookButtonGradient: {
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.sm,
  },

  bookButtonText: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
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
