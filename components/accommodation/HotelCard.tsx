import { EnrichedHotel } from "@/utils/accommodationAdapter";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  hotel: EnrichedHotel;
  onPress: (hotel: EnrichedHotel) => void;
  style?: ViewStyle;
}

const HotelCard = ({ hotel, onPress, style }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageUri = hotel.thumbnail || (hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery[0] : null);

  const handlePress = useCallback(() => {
    onPress(hotel);
  }, [hotel, onPress]);

  const toggleFavorite = useCallback((e: any) => {
    e.stopPropagation?.();
    setIsFavorite((prev) => !prev);
  }, []);

  const isUltraClose = hotel.distance_meters < 500;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={0.92}
      onPress={handlePress}
    >
      {/* 1. Media Header */}
      <View style={styles.mediaContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={250}
          />
        ) : (
          <View style={[styles.image, { backgroundColor: "#E0DBD5", justifyContent: "center", alignItems: "center" }]}>
            <MaterialCommunityIcons name="temple-hindu" size={40} color="#877274" />
          </View>
        )}

        {/* Gradient Scrim */}
        <LinearGradient
          colors={["rgba(0,0,0,0.35)", "transparent", "rgba(78, 5, 26, 0.8)"]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Proximity Ribbon (Top Left - only if provided by API) */}
        {hotel.distance_to_mahakal ? (
          <View
            style={[
              styles.proximityRibbon,
              isUltraClose && styles.proximityRibbonUltra,
            ]}
          >
            <MaterialCommunityIcons
              name={isUltraClose ? "timer-outline" : "walk"}
              size={14}
              color={isUltraClose ? "#4A2800" : "#FFDF98"}
            />
            <Text
              style={[
                styles.proximityText,
                isUltraClose && styles.proximityTextUltra,
              ]}
            >
              {hotel.distance_to_mahakal}{hotel.walk_time ? ` · ${hotel.walk_time}` : ""}
            </Text>
          </View>
        ) : null}

        {/* Favorite Wishlist Button (Top Right) */}
        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.8}
          onPress={toggleFavorite}
          accessibilityLabel="Save to wishlist"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? COLORS.primary : "#4E051A"}
          />
        </TouchableOpacity>

        {/* Base Media Overlays (Category Tag + Rating Pill) */}
        <View style={styles.mediaBaseRow}>
          {hotel.property_badge ? (
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{hotel.property_badge}</Text>
            </View>
          ) : <View />}

          {hotel.rating > 0 ? (
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#FE932C" />
              <Text style={styles.ratingScore}>{hotel.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* 2. Card Content Body */}
      <View style={styles.body}>
        {/* Title & Neighborhood */}
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {hotel.name}
          </Text>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="compass-outline" size={14} color="#877274" />
            <Text style={styles.locationText} numberOfLines={1}>
              {hotel.category ? `${hotel.category.toUpperCase()} · ` : ""}
              {hotel.location}
            </Text>
          </View>
        </View>

        {/* Sacred Route Marker Micro-Card (only if API returns landmark_note) */}
        {hotel.landmark_note ? (
          <View style={styles.routeMicroCard}>
            <MaterialCommunityIcons
              name="navigation-variant"
              size={15}
              color={COLORS.secondary}
            />
            <Text style={styles.routeText} numberOfLines={1}>
              {hotel.landmark_note}
            </Text>
          </View>
        ) : null}

        {/* Amenity Pills (only from actual API amenities) */}
        {hotel.amenities && hotel.amenities.length > 0 ? (
          <View style={styles.amenitiesRow}>
            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <View key={amenity.name || idx} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* 3. Card Footer: Price & View Details Action */}
        <View style={styles.footerRow}>
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceAmount}>₹{hotel.price.toLocaleString("en-IN")}</Text>
              <Text style={styles.priceUnit}> / night</Text>
            </View>
            <Text style={styles.taxNote}>Taxes included · Pay at property</Text>
          </View>

          <View style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(HotelCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
    ...SHADOWS.md,
  },
  mediaContainer: {
    width: "100%",
    height: 190,
    position: "relative",
    backgroundColor: "#EBE8E3",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  proximityRibbon: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: "rgba(78, 5, 26, 0.92)",
  },
  proximityRibbonUltra: {
    backgroundColor: "#FE932C",
  },
  proximityText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFDF98",
  },
  proximityTextUltra: {
    color: "#4A2800",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    justifyContent: "center",
    alignItems: "center",
  },
  mediaBaseRow: {
    position: "absolute",
    bottom: 8,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  categoryText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: "#FFFFFF",
    ...SHADOWS.xs,
  },
  ratingScore: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#4E051A",
  },
  reviewCount: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: "#877274",
  },
  body: {
    padding: 14,
    gap: 10,
  },
  name: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#544244",
    flex: 1,
  },
  routeMicroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F6F3EE",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.sm,
  },
  routeText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#544244",
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  amenityChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F0EDE9",
  },
  amenityText: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: "#544244",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(107, 29, 47, 0.06)",
    marginVertical: 2,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceAmount: {
    fontSize: 20,
    fontFamily: FONTS.display.bold,
    color: "#4E051A",
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#877274",
  },
  taxNote: {
    fontSize: 10,
    fontFamily: FONTS.body.semiBold,
    color: "#904D00",
    marginTop: 1,
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4E051A",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
    ...SHADOWS.xs,
  },
  viewDetailsText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
