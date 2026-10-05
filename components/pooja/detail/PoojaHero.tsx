import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaItem } from "@/types/pooja";
import { getPoojaFallbackImage } from "@/services/poojaService";

interface PoojaHeroProps {
  item: PoojaItem;
  onBack: () => void;
  onShare: () => void;
}

export const PoojaHero: React.FC<PoojaHeroProps> = ({
  item,
  onBack,
  onShare,
}) => {
  const displayImage =
    item.image && typeof item.image === "string" && item.image.trim() !== ""
      ? item.image.trim()
      : getPoojaFallbackImage(item.category);

  return (
    <View style={styles.heroContainer}>
      <Image
        source={{ uri: displayImage }}
        style={styles.heroImage}
        contentFit="cover"
        transition={250}
      />

      {/* Subtle photographic vignette and bottom text gradient */}
      <LinearGradient
        colors={[
          "rgba(0, 0, 0, 0.55)",
          "transparent",
          "rgba(35, 12, 16, 0.94)",
        ]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top Navigation Controls */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={onShare}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Share pooja details"
        >
          <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Hero Details: Temple Provenance, Tag & Title */}
      <View style={styles.heroDetails}>
        <View style={styles.badgeRow}>
          <View style={styles.templePill}>
            <Ionicons name="location-sharp" size={11} color="#FFE082" />
            <Text style={styles.templePillText} maxFontSizeMultiplier={1.2}>
              {item.temple}
            </Text>
          </View>

          {item.badge_tag ? (
            <View style={styles.badgeTagPill}>
              <Text style={styles.badgeTagPillText} maxFontSizeMultiplier={1.2}>
                {item.badge_tag}
              </Text>
            </View>
          ) : item.is_featured ? (
            <View style={styles.featuredPill}>
              <Text style={styles.featuredPillText} maxFontSizeMultiplier={1.2}>
                VEDIC PARAMPARA
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          style={styles.heroTitle}
          numberOfLines={3}
          maxFontSizeMultiplier={1.25}
        >
          {item.title}
        </Text>

        {/* Social Proof Trust Signal - Proximity to Title (PDP Masterclass Mistake 9) */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingStarBadge}>
            <Ionicons name="star" size={11} color="#FFD700" />
            <Text style={styles.ratingNumber} maxFontSizeMultiplier={1.2}>4.9</Text>
          </View>
          <Text style={styles.devoteeCountText} maxFontSizeMultiplier={1.2}>
            350+ Devotees Sanctified
          </Text>
          <View style={styles.verifiedDivider} />
          <Ionicons name="shield-checkmark" size={11} color="#A7F3D0" />
          <Text style={styles.guaranteeText} maxFontSizeMultiplier={1.2}>
            Authentic Vidhi
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    width: "100%",
    minHeight: 290,
    position: "relative",
    backgroundColor: COLORS.surfaceMuted,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  topNav: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  navButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(20, 12, 14, 0.50)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  heroDetails: {
    position: "absolute",
    bottom: 18,
    left: 16,
    right: 16,
    zIndex: 5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  templePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(35, 12, 16, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 224, 130, 0.35)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  templePillText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFE082",
  },
  badgeTagPill: {
    backgroundColor: "rgba(184, 128, 46, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  badgeTagPillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  featuredPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featuredPillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 21,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    lineHeight: 28,
    letterSpacing: -0.2,
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    flexWrap: "wrap",
  },
  ratingStarBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.22)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.4)",
  },
  ratingNumber: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFD700",
  },
  devoteeCountText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "rgba(255, 255, 255, 0.9)",
  },
  verifiedDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 2,
  },
  guaranteeText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#A7F3D0",
  },
});
