import { AccommodationHighlight } from "@/types/service";
import { COLORS } from "@/constants/colors";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  highlights: AccommodationHighlight[];
}

// Default icons when API icon is null
const DEFAULT_ICONS: Record<string, string> = {
  "near temple": "📍",
  "best price": "💰",
  "family friendly": "👨‍👩‍👧",
  "24/7 support": "🛡️",
};

const getDefaultIcon = (label: string): string => {
  const key = label.toLowerCase().trim();
  return DEFAULT_ICONS[key] || "⭐";
};

const HighlightsRow = ({ highlights }: Props) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {highlights.map((item, index) => (
          <View key={index} style={styles.pill}>
            {item.icon ? (
              <Image
                source={{ uri: item.icon }}
                style={styles.iconImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.iconEmoji}>
                {getDefaultIcon(item.label)}
              </Text>
            )}
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(HighlightsRow);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 8,
  },

  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  iconImage: {
    width: 20,
    height: 20,
  },

  iconEmoji: {
    fontSize: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
    letterSpacing: 0.1,
  },
});
