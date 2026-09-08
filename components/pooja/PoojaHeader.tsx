import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
          <Ionicons name="arrow-back" size={20} color="#2C2C2C" />
        </TouchableOpacity>
      ) : null}

      {/* Decorative Sacred Ribbon */}
      <LinearGradient
        colors={["#922C45", "#C45E71", "#FB9353"]}
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
  banner: {
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#922C45",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  omBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  omText: {
    fontSize: 26,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bannerContent: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FDE68A",
    letterSpacing: 1,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  bannerDesc: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    lineHeight: 16,
  },
});
