import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  noPadding?: boolean;
}
export default function ScreenContainer({
  children,
  noPadding = false,
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View
        style={[
          styles.container,
          noPadding && { paddingHorizontal: 0, paddingTop: 0 },
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F2EA", // 🔥 your premium background
  },
  container: {
    flex: 1,
    paddingHorizontal: 14, // 👈 FIXED spacing
    paddingTop: 10,
  },
});
