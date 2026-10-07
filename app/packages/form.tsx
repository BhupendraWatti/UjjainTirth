import ScreenContainer from "@/components/layout/ScreenContainer";
import DynamicPackageForm from "@/components/packages/DynamicPackageForm";
import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function PackageFormScreen() {
  return (
    <ScreenContainer noPadding>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
          accessibilityLabel="Back to previous screen"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>
      </View>

      {/* Dynamic Package & Cost Enquiry Form */}
      <View style={styles.formWrapper}>
        <DynamicPackageForm showHeader={true} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: "#F4E5BE",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  formWrapper: {
    flex: 1,
  },
});
