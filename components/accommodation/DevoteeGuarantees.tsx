import { AccommodationHighlight } from "@/types/service";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  highlights?: AccommodationHighlight[];
}

const getHighlightIcon = (label: string): string => {
  const l = label.toLowerCase();
  if (l.includes("temple") || l.includes("mahakal") || l.includes("sanctum")) return "temple-hindu";
  if (l.includes("price") || l.includes("rate") || l.includes("cost")) return "tag-check";
  if (l.includes("family") || l.includes("group")) return "account-group";
  if (l.includes("drop") || l.includes("rickshaw") || l.includes("cab") || l.includes("transit")) return "rickshaw";
  if (l.includes("support") || l.includes("help") || l.includes("desk")) return "shield-check";
  return "star-circle";
};

export default function DevoteeGuarantees({ highlights }: Props) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {highlights.map((item, idx) => {
        const iconName = getHighlightIcon(item.label);
        const isHighlight = idx === 0;

        return (
          <View
            key={idx}
            style={[styles.badge, isHighlight && styles.badgeHighlight]}
          >
            <MaterialCommunityIcons
              name={iconName as any}
              size={14}
              color={isHighlight ? "#904D00" : COLORS.secondary}
            />
            <Text
              style={[styles.badgeText, isHighlight && styles.badgeTextHighlight]}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F6F3EE",
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.04)",
  },
  badgeHighlight: {
    backgroundColor: "rgba(255, 220, 195, 0.45)",
    borderColor: "rgba(254, 147, 44, 0.3)",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#1C1C19",
  },
  badgeTextHighlight: {
    color: "#2F1500",
    fontFamily: FONTS.body.semiBold,
  },
});
