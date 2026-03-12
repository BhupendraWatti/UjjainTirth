import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TempleSearchProps {
  onSearch: (value: string) => void;
}

const TempleSearch = ({ onSearch }: TempleSearchProps) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500); // debounce 500ms

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#777" />

      <TextInput
        placeholder="Search temples..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default TempleSearch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 14,
    borderRadius: 25,
    height: 45,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});