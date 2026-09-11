import { Hotel } from "@/types/service";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface Props {
  hotel: Hotel;
  onPress: (hotel: Hotel) => void;
  style?: ViewStyle;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80";

// ── Star Rating Component ──
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Text key={i} style={styles.starFilled}>★</Text>
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <Text key={i} style={styles.starHalf}>★</Text>
      );
    } else {
      stars.push(
        <Text key={i} style={styles.starEmpty}>★</Text>
      );
    }
  }

  return (
    <View style={styles.starsRow}>
      {stars}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const HotelCard = ({ hotel, onPress, style }: Props) => {
  const imageUri = hotel.thumbnail || PLACEHOLDER_IMAGE;

  const handlePress = useCallback(() => {
    onPress(hotel);
  }, [hotel, onPress]);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={styles.row}>
        {/* Thumbnail */}
        <Image
          source={{ uri: imageUri }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {hotel.name}
          </Text>

          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location} numberOfLines={1}>
              {hotel.location}
            </Text>
          </View>

          <StarRating rating={hotel.rating} />

          {/* Amenity Tags */}
          {hotel.amenities.length > 0 && (
            <View style={styles.amenitiesRow}>
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <View key={idx} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.priceSymbol}>₹</Text>
            <Text style={styles.priceAmount}>
              {hotel.price.toLocaleString("en-IN")}
            </Text>
            <Text style={styles.priceUnit}>/night</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(HotelCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    // Warm Shadow
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
  },

  thumbnail: {
    width: 100,
    height: 120,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
  },

  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 16,
    fontFamily: FONTS.display.regular,
    color: COLORS.ink,
    marginBottom: 3,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 4,
  },

  locationIcon: {
    fontSize: 11,
  },

  location: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    flex: 1,
  },

  // Stars
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginBottom: 6,
  },

  starFilled: {
    fontSize: 14,
    color: COLORS.gold,
  },

  starHalf: {
    fontSize: 14,
    color: COLORS.gold,
    opacity: 0.6,
  },

  starEmpty: {
    fontSize: 14,
    color: "#D4D4D4",
  },

  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginLeft: 4,
  },

  // Amenities
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 6,
  },

  amenityTag: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },

  amenityText: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },

  // Price
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  priceSymbol: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },

  priceAmount: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.primary,
    letterSpacing: -0.3,
  },

  priceUnit: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginLeft: 2,
  },
});
