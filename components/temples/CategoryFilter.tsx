import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

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
          { marginRight: 12 }, // 🔥 extra gap after All
        ]}
        onPress={() => onSelect(null)}
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
    marginVertical: 9,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    marginVertical: 4,
    borderWidth: 0.3,
  },
  activeChip: {
    backgroundColor: "#EB5C49",
  },
  text: {
    color: "#444",
    fontSize: 13,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 10, // 🔥 gives breathing space on edges
  },
});
