import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BadgeProps {
  label: string;
}

const Badge = ({ label }: BadgeProps) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export default Badge;

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#FFE6D5",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 13,
    color: "#FF6A00",
    fontWeight: "800",
  },
});
