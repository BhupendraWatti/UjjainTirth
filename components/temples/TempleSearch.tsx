import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface TempleSearchProps {
  onSearch: (value: string) => void;
}

const TempleSearch = ({ onSearch }: TempleSearchProps) => {
  const [query, setQuery] = useState("");

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 18,
    borderRadius: 20,
    height: 55,
    borderWidth: 0.3,
    marginVertical: 6,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});
