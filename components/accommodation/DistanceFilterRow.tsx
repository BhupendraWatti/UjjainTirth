import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type DistanceFilterType =
  | "all"
  | "under_500m"
  | "500m_2km"
  | "2km_5km"
  | "near_station";

interface Props {
  selectedFilter: DistanceFilterType;
  onSelectFilter: (filter: DistanceFilterType) => void;
}

const FILTERS: { id: DistanceFilterType; label: string; badge?: string }[] = [
  { id: "all", label: "All Stays" },
  { id: "under_500m", label: "Under 500 m", badge: "Walking" },
  { id: "500m_2km", label: "500 m – 2 km" },
  { id: "2km_5km", label: "2 – 5 km" },
  { id: "near_station", label: "Near Railway Stn" },
];

export default function DistanceFilterRow({
  selectedFilter,
  onSelectFilter,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Ornamental Section Title */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>Stay Near What Matters</Text>
        <View style={styles.decorCue}>
          <View style={styles.decorLine} />
          <MaterialCommunityIcons name="spa" size={13} color={COLORS.secondary} />
          <View style={styles.decorLine} />
        </View>
      </View>

      {/* Filter Chips Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTERS.map((item) => {
          const isActive = selectedFilter === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.75}
              onPress={() => onSelectFilter(item.id)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item.label}
              </Text>
              {item.badge ? (
                <View style={[styles.miniBadge, isActive && styles.miniBadgeActive]}>
                  <Text style={[styles.miniBadgeText, isActive && styles.miniBadgeTextActive]}>
                    {item.badge}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 34,
    paddingBottom: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#6B1D2F",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  decorCue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    opacity: 0.6,
  },
  decorLine: {
    width: 20,
    height: 1,
    backgroundColor: "#DAC0C2",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: "#F0EDE9",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "#6B1D2F",
    borderColor: "#4E051A",
  },
  chipText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: "#544244",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    backgroundColor: "#FFDCC3",
  },
  miniBadgeActive: {
    backgroundColor: "#FFDF98",
  },
  miniBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#663500",
    textTransform: "uppercase",
  },
  miniBadgeTextActive: {
    color: "#4A3700",
  },
});
