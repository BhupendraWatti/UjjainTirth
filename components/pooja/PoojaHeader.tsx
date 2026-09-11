import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";

interface Props {
  showBackButton?: boolean;
}

const PoojaHeader = ({ showBackButton = true }: Props) => {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>
      ) : null}

      {/* Decorative Sacred Ribbon */}
      <LinearGradient
        colors={[COLORS.sacred, "#99293B", COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.omBadge}>
          <Text style={styles.omText}>ॐ</Text>
        </View>

        <View style={styles.bannerContent}>
          <Text style={styles.bannerSubtitle}>UJJAIN TIRTH PUJA SEVA</Text>
          <Text style={styles.bannerTitle}>Sacred Pooja & Rituals</Text>
          <Text style={styles.bannerDesc}>
            Vedic rituals, abhishek & dosh shanti by learned temple priests
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default memo(PoojaHeader);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...SHADOWS.subtle,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    padding: 16,
    overflow: "hidden",
    ...SHADOWS.card,
  },
  omBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  omText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: FONTS.display.semiBold,
  },
  bannerContent: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.primaryTint,
    letterSpacing: 1,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  bannerDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 16,
    marginTop: 4,
  },
});
