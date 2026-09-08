import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        <Ionicons name="arrow-back" size={20} color="#2C2C2C" />
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
  titleContainer: {
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2A2A2A",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6F6F6F",
    marginTop: 4,
    lineHeight: 18,
  },
});
