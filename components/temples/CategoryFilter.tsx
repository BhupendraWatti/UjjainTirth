import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

const CategoryFilter = ({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          selected === null && styles.activeChip,
          { marginRight: 12 },
        ]}
        onPress={() => onSelect(null)}
        activeOpacity={0.8}
        accessibilityRole="tab"
        accessibilityState={{ selected: selected === null }}
      >
        <Text
          numberOfLines={1}
          style={[styles.text, selected === null && styles.activeText]}
        >
          All
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const active = selected === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, active && styles.activeChip]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.bgStone,
    borderRadius: RADIUS.sm,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: {
    color: COLORS.inkBody,
    fontSize: 13,
    fontFamily: FONTS.body.medium,
  },
  activeText: {
    color: "#FFFFFF",
    fontFamily: FONTS.body.bold,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
});
