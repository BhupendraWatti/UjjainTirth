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
    borderRadius: 20,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: "#EB5C49",
    borderColor: "#EB5C49",
    shadowColor: "#EB5C49",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pillInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  pillTextInactive: {
    color: "#555555",
  },
});
