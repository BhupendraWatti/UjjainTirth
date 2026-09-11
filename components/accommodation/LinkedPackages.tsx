import { LinkedPackage } from "@/types/service";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  packages: LinkedPackage[];
}

const LinkedPackages = ({ packages }: Props) => {
  if (!packages || packages.length === 0) return null;

  const handlePress = () => {
    router.push("/(tabs)/packages" as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Explore Packages</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {packages.map((pkg, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.85}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={pkg.title}
          >
            <LinearGradient
              colors={
                index % 2 === 0
                  ? [COLORS.primary, COLORS.primaryDeep]
                  : ["#9E2A3A", COLORS.sacred]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>{pkg.title}</Text>
              <Text style={styles.cardCta}>View Details</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(LinkedPackages);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 14,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },

  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },

  card: {
    width: 180,
    height: 100,
    borderRadius: RADIUS.md,
    padding: 16,
    justifyContent: "space-between",
    ...SHADOWS.card,
  },

  cardTitle: {
    fontSize: 15,
    fontFamily: FONTS.display.regular,
    color: "#FFFFFF",
  },

  cardCta: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: "rgba(255,255,255,0.85)",
  },
});
