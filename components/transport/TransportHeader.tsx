import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { SHADOWS } from "@/constants/theme";

interface Props {
  onBack?: () => void;
}

const TransportHeader = ({ onBack }: Props) => {
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

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pilgrimage Transport</Text>
        <Text style={styles.subtitle}>
          Verified AC cabs & group coaches with experienced drivers
        </Text>
      </View>
    </View>
  );
};

export default memo(TransportHeader);

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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    ...SHADOWS.subtle,
  },
  titleContainer: {},
  title: {
    fontSize: 22,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
});
