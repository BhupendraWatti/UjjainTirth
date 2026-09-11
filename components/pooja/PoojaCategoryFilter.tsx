import React, { memo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";

export interface PoojaCategoryTab {
  id: string;
  label: string;
  badge?: string;
}

const CATEGORIES: PoojaCategoryTab[] = [
  { id: "all", label: "All Rituals" },
  { id: "shiva", label: "Lord Shiva Abhishek" },
  { id: "special", label: "Mangalnath / Bhat Pooja" },
  { id: "protection", label: "Protection & Dosh Shanti" },
  { id: "prosperity", label: "Prosperity & Devi" },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const PoojaCategoryFilter = ({ selectedCategory, onSelectCategory }: Props) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.75}
              onPress={() => onSelectCategory(cat.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={[styles.pill, isSelected ? styles.pillActive : styles.pillInactive]}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.pillTextActive : styles.pillTextInactive,
                ]}
              >
                {cat.label}
              </Text>
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
    marginBottom: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
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
});
