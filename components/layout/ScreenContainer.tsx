import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
}

export default function ScreenContainer({ children }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F2EA",
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
});
