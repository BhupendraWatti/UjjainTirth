import { Hotel } from "@/types/service";
import { COLORS } from "@/constants/colors";
import { APP_CONFIG } from "@/constants/appConfig";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  visible: boolean;
  hotel: Hotel | null;
  onClose: () => void;
}

export default function HotelDetailModal({ visible, hotel, onClose }: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible && hotel) {
      setActiveSlide(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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
        Alert.alert("Cannot Make Call", "Phone calling is not supported.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  if (!hotel) return null;

  // Gallery: use gallery if available, else fallback to thumbnail
  const images =
    hotel.gallery.length > 0
      ? hotel.gallery
      : hotel.thumbnail
        ? [hotel.thumbnail]
        : [];

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    setActiveSlide(slideIndex);
  };

  // Star rating
  const renderStars = () => {
    const stars = [];
    const full = Math.floor(hotel.rating);
    const hasHalf = hotel.rating - full >= 0.25;
    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push(<Text key={i} style={styles.starFilled}>★</Text>);
      else if (i === full && hasHalf) stars.push(<Text key={i} style={styles.starHalf}>★</Text>);
      else stars.push(<Text key={i} style={styles.starEmpty}>★</Text>);
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Image Slider */}
          {images.length > 0 && (
            <View style={styles.sliderContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {images.map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    style={styles.sliderImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Gradient overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)"]}
                style={styles.sliderGradient}
              />

              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>

              {/* Dots */}
              {images.length > 1 && (
                <View style={styles.dotsRow}>
                  {images.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        activeSlide === idx && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              )}

              {/* Name on image */}
              <View style={styles.sliderTitleContainer}>
                <Text style={styles.sliderTitle}>{hotel.name}</Text>
              </View>
            </View>
          )}

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Location + Rating */}
            <View style={styles.section}>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{hotel.location}</Text>
              </View>
              <View style={styles.ratingRow}>
                {renderStars()}
                <Text style={styles.ratingNumber}>
                  {hotel.rating.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Amenities */}
            {hotel.amenities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.amenitiesGrid}>
                  {hotel.amenities.map((amenity, idx) => (
                    <View key={idx} style={styles.amenityChip}>
                      <Text style={styles.amenityChipText}>
                        {amenity.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Price Section */}
            <View style={styles.section}>
              <View style={styles.priceCard}>
                <View>
                  <Text style={styles.priceLabel}>Price per night</Text>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceSymbol}>₹</Text>
                    <Text style={styles.priceAmount}>
                      {hotel.price.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>
                    {hotel.category.charAt(0).toUpperCase() +
                      hotel.category.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 140 }} />
          </Animated.View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.7}
            onPress={handleCall}
          >
            <LinearGradient
              colors={[COLORS.primary, "#D94535"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Book Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EA",
  },

  scrollContent: {
    flexGrow: 1,
  },

  // Slider
  sliderContainer: {
    height: 300,
    position: "relative",
  },

  sliderImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },

  sliderGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
  },

  closeText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  dotsRow: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  dotActive: {
    backgroundColor: "#FFF",
    width: 20,
  },

  sliderTitleContainer: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
  },

  sliderTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  // Sections
  section: {
    marginHorizontal: 16,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  locationIcon: {
    fontSize: 14,
  },

  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  starFilled: { fontSize: 18, color: "#F5A623" },
  starHalf: { fontSize: 18, color: "#F5C86380" },
  starEmpty: { fontSize: 18, color: "#D4D4D4" },

  ratingNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textDark,
    marginLeft: 6,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  amenityChip: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  amenityChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  // Price
  priceCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  priceLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },

  priceValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },

  priceSymbol: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },

  priceAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },

  categoryBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
    backgroundColor: "rgba(245,242,234,0.97)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },

  ctaButton: {
    borderRadius: 14,
    overflow: "hidden",
  },

  ctaGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 14,
  },

  ctaText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
