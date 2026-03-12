import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Category {
  id: number;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.chip, selected === null && styles.activeChip]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.text, selected === null && styles.activeText]}>
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
    marginTop: 10,
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EEE',
    borderRadius: 20,
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: '#FF6A00',
  },
  text: {
    color: '#444',
  },
  activeText: {
    color: '#fff',
  },
});