import React, { memo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    borderRadius: 20,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: "#922C45",
    borderColor: "#922C45",
    shadowColor: "#922C45",
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
