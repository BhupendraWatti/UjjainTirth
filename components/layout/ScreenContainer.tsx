import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
}

const ScreenContainer = ({ children }: ScreenContainerProps) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenContainer;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F2EA",
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
