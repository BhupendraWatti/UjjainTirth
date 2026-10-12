import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

import { COLORS } from "@/constants/colors";
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
        <MaterialIcons name="verified-user" size={24} color={COLORS.goldLight} />
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
    backgroundColor: COLORS.surfaceMuted,
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
    backgroundColor: COLORS.sacred,
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacredDeep,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 16,
  },
});
