import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

export interface ScreenContainerProps {
  children: React.ReactNode;
  noPadding?: boolean;
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({
  children,
  noPadding = false,
  edges = ["top"],
  style,
  containerStyle,
}: ScreenContainerProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      <View
        style={[
          styles.container,
          noPadding && styles.noPadding,
          containerStyle,
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
    paddingTop: 8,
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});

