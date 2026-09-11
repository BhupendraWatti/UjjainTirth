import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

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
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
});

