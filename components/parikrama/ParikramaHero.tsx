import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onBack?: () => void;
}

const ParikramaHero = ({ onBack }: Props) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
      </TouchableOpacity>

      <LinearGradient
        colors={[COLORS.journey, "#158498"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.waterDropBadge}>
          <Ionicons name="water" size={26} color="#FFFFFF" />
        </View>

        <View style={styles.bannerTextContainer}>
          <Text style={styles.sacredChant}>नर्मदे हर • NARMADE HAR</Text>
          <Text style={styles.bannerTitle}>Narmada Parikrama</Text>
          <Text style={styles.bannerSubtitle}>
            Circumambulation of the holy river of salvation & sacred ghats
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default memo(ParikramaHero);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.bgStone,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...SHADOWS.subtle,
  },
  heroBanner: {
    borderRadius: RADIUS.md,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    ...SHADOWS.elevated,
  },
  waterDropBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  bannerTextContainer: {
    flex: 1,
  },
  sacredChant: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.journeyTint,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.bold,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    lineHeight: 16,
  },
});
