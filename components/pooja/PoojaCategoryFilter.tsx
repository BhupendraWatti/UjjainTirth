import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import * as Haptics from "expo-haptics";
import React, { memo, useCallback } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface PoojaCategoryTab {
  id: string;
  label: string;
  badgeKey?: string;
}

const CATEGORIES: PoojaCategoryTab[] = [
  { id: "all", label: "All Rituals", badgeKey: "all" },
  { id: "shiva", label: "Lord Shiva Abhishek", badgeKey: "shiva" },
  { id: "special", label: "Mangalnath / Bhat", badgeKey: "special" },
  { id: "protection", label: "Protection & Dosh", badgeKey: "protection" },
  { id: "prosperity", label: "Prosperity & Devi", badgeKey: "prosperity" },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  counts?: Record<string, number>;
}

const PoojaCategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  counts = {},
}: Props) => {
  const handleSelect = useCallback(
    (catId: string) => {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
      onSelectCategory(catId);
    },
    [onSelectCategory]
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.badgeKey ? counts[cat.badgeKey] : undefined;

          // Only hide if count is strictly 0 and not "all" and not selected
          if (count === 0 && cat.id !== "all" && !isSelected) {
            return null;
          }

          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => handleSelect(cat.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.pill,
                isSelected ? styles.pillActive : styles.pillInactive,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.pillTextActive : styles.pillTextInactive,
                ]}
              >
                {cat.label}
              </Text>

              {count !== undefined && count > 0 ? (
                <View
                  style={[
                    styles.countBadge,
                    isSelected
                      ? styles.countBadgeActive
                      : styles.countBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countBadgeText,
                      isSelected
                        ? styles.countBadgeTextActive
                        : styles.countBadgeTextInactive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(PoojaCategoryFilter);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    minHeight: 38,
  },
  pillActive: {
    backgroundColor: COLORS.sacred,
    borderColor: COLORS.sacred,
    ...SHADOWS.subtle,
  },
  pillInactive: {
    backgroundColor: COLORS.bgStone,
    borderColor: COLORS.hairline,
  },
  pillText: {
    fontSize: 13,
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontFamily: FONTS.body.bold,
  },
  pillTextInactive: {
    color: COLORS.inkBody,
    fontFamily: FONTS.body.medium,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  countBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  countBadgeInactive: {
    backgroundColor: "rgba(43, 36, 32, 0.08)",
  },
  countBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
  },
  countBadgeTextActive: {
    color: "#FFFFFF",
  },
  countBadgeTextInactive: {
    color: COLORS.inkMuted,
  },
});
