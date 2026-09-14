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
            <Text style={styles.templePillText}>{item.temple}</Text>
          </View>

          {item.badge_tag ? (
            <View style={styles.badgeTagPill}>
              <Text style={styles.badgeTagPillText}>{item.badge_tag}</Text>
            </View>
          ) : item.is_featured ? (
            <View style={styles.featuredPill}>
              <Text style={styles.featuredPillText}>VEDIC PARAMPARA</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.heroTitle}>{item.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    width: "100%",
    height: 290,
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
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "rgba(35, 12, 16, 0.82)",
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
  },
  badgeTagPillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  featuredPill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  featuredPillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    lineHeight: 30,
    letterSpacing: -0.3,
  },
});
