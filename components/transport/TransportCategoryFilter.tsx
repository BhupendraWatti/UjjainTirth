import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import React, { memo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface CategoryOption {
  id: string;
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All Vehicles" },
  { id: "local", label: "Local Darshan" },
  { id: "group", label: "Group Yatra" },
  { id: "airport / station", label: "Station / Airport" },
  { id: "outstation", label: "Outstation" },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const TransportCategoryFilter = ({ selectedCategory, onSelectCategory }: Props) => {
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

export default memo(TransportCategoryFilter);

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
  },
  pillActive: {
    backgroundColor: COLORS.journey,
    borderColor: COLORS.journey,
    ...SHADOWS.subtle,
  },
  pillInactive: {
    backgroundColor: COLORS.bgStone,
    borderColor: COLORS.hairline,
  },
  pillText: {
    fontSize: 13,
    fontFamily: FONTS.body.semiBold,
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  pillTextInactive: {
    color: COLORS.inkBody,
  },
});
