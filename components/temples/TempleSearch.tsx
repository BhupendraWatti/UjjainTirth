import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";

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
      <Ionicons name="search" size={20} color={COLORS.inkMuted} />

      <TextInput
        placeholder="Search temples..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholderTextColor={COLORS.inkFaint}
      />
    </View>
  );
};

export default TempleSearch;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginVertical: 6,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
  },
});
