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
        <Ionicons name="arrow-back" size={20} color="#2C2C2C" />
      </TouchableOpacity>

      <LinearGradient
        colors={["#0A4D68", "#088395", "#05BFDB"]}
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
    backgroundColor: "#F4E5BE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  heroBanner: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#088395",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
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
    fontWeight: "800",
    color: "#E0F7FA",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    lineHeight: 16,
  },
});
