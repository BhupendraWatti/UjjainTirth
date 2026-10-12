import { EnrichedHotel } from "@/utils/accommodationAdapter";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HIT_SLOP } from "@/constants/layout";
interface Props {
  hotel: EnrichedHotel;
  onShare?: () => void;
}

export default function GalleryHeader({ hotel, onShare }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const sliderHeight = Math.min(320, width * 0.75);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images =
    hotel.gallery.length > 0
      ? hotel.gallery
      : hotel.thumbnail
      ? [hotel.thumbnail]
      : [];

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveSlide(idx);
  };

  return (
    <View style={[styles.container, { width, height: sliderHeight }]}>
      {/* Horizontal Image Carousel */}
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
            style={{ width, height: sliderHeight }}
            contentFit="cover"
            transition={200}
          />
        ))}
        {images.length === 0 && (
          <View style={[styles.fallbackContainer, { width, height: sliderHeight }]}>
            <MaterialCommunityIcons name="image-outline" size={48} color="#A09895" />
          </View>
        )}
      </ScrollView>

      {/* Top and Bottom Gradient Scrims */}
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent", "rgba(0,0,0,0.65)"]}
        locations={[0, 0.45, 1]}
        style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
      />

      {/* Top Action Nav Bar */}
      <View style={[styles.topBar, { top: Math.max(10, insets.top + 6) }]}>
        <TouchableOpacity hitSlop={HIT_SLOP}
          style={styles.navCircleBtn}
          activeOpacity={0.8}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity hitSlop={HIT_SLOP}
            style={styles.navCircleBtn}
            activeOpacity={0.8}
            onPress={onShare}
            accessibilityLabel="Share"
          >
            <Ionicons name="share-social-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity hitSlop={HIT_SLOP}
            style={[styles.navCircleBtn, isFavorite && styles.navCircleBtnActive]}
            activeOpacity={0.8}
            onPress={() => setIsFavorite((f) => !f)}
            accessibilityLabel="Bookmark"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isFavorite ? COLORS.white : COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tirth Shuddhi Badge (Top Left Overlay) */}
      <View style={[styles.badgeOverlay, { top: Math.max(64, insets.top + 52) }]}>
        <View style={styles.shuddhiPill}>
          <MaterialIcons name="verified" size={14} color={COLORS.saffron} />
          <Text style={styles.shuddhiText}>Tirth Shuddhi Certified</Text>
        </View>
      </View>

      {/* Bottom Overlays: Category Pill (Left) & Counter (Right) */}
      <View style={styles.bottomBar}>
        <View style={styles.categoryPill}>
          <MaterialCommunityIcons name="temple-hindu" size={13} color={COLORS.goldLight} />
          <Text style={styles.categoryText}>{hotel.property_badge}</Text>
        </View>

        {images.length > 1 && (
          <View style={styles.counterPill}>
            <Text style={styles.counterText}>
              {activeSlide + 1} / {images.length}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: COLORS.bgStone,
  },
  fallbackContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bgStone,
  },
  topBar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  topRightActions: {
    flexDirection: "row",
    gap: 8,
  },
  navCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  navCircleBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  badgeOverlay: {
    position: "absolute",
    left: 16,
    zIndex: 10,
  },
  shuddhiPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  shuddhiText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacredDeep,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  bottomBar: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: "rgba(107, 29, 47, 0.88)",
  },
  categoryText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.goldLight,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    flexShrink: 1,
  },
  counterPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  counterText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.white,
    letterSpacing: 1,
  },
});
