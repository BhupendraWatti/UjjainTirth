import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  title?: string;
  description?: string;
}

export default function TirthShuddhiBanner({ title, description }: Props) {
  const displayTitle = title?.trim() || "";
  const displayDesc = description?.trim() || "";

  if (!displayTitle && !displayDesc) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <MaterialIcons name="verified-user" size={24} color="#FFDF98" />
      </View>
      <View style={styles.textBox}>
        {displayTitle ? <Text style={styles.title}>{displayTitle}</Text> : null}
        {displayDesc ? <Text style={styles.description}>{displayDesc}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: "#F0EDE9",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
    ...SHADOWS.xs,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: "#6B1D2F",
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#544244",
    lineHeight: 16,
  },
});
