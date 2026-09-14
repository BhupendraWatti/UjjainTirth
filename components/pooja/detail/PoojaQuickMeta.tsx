import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaItem } from "@/types/pooja";

interface PoojaQuickMetaProps {
  item: PoojaItem;
}

export const PoojaQuickMeta: React.FC<PoojaQuickMetaProps> = ({ item }) => {
  const muhuratDisplay = item.muhurat_timings
    ? item.muhurat_timings.split("(")[0].trim()
    : "Daily Morning";

  return (
    <View style={styles.metaStrip}>
      <View style={styles.metaItem}>
        <Text style={styles.metaLabel}>DURATION</Text>
        <Text style={styles.metaValue} numberOfLines={1}>
          {item.duration || "45–60 min"}
        </Text>
      </View>

      <View style={styles.metaDivider} />

      <View style={styles.metaItemCenter}>
        <Text style={styles.metaLabel}>MUHURAT</Text>
        <Text style={styles.metaValue} numberOfLines={1}>
          {muhuratDisplay}
        </Text>
      </View>

      <View style={styles.metaDivider} />

      <View style={styles.metaItem}>
        <Text style={styles.metaLabel}>DHAM</Text>
        <Text style={styles.metaValue} numberOfLines={1}>
          Ujjain Dham
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metaStrip: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaItem: {
    flex: 1,
  },
  metaItemCenter: {
    flex: 1.2,
    paddingHorizontal: 4,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.hairline,
    marginHorizontal: 8,
  },
});
