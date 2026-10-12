import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

import { COLORS } from "@/constants/colors";
export type DetailTabType = "overview" | "rooms" | "amenities" | "route";

interface Props {
  activeTab: DetailTabType;
  onSelectTab: (tab: DetailTabType) => void;
  hasRooms?: boolean;
  roomCount?: number;
  hasAmenities?: boolean;
  hasRoute?: boolean;
}

export default function SegmentedTabs({
  activeTab,
  onSelectTab,
  hasRooms = false,
  roomCount = 0,
  hasAmenities = false,
  hasRoute = false,
}: Props) {
  const tabs: { id: DetailTabType; label: string }[] = [
    { id: "overview", label: "Overview" },
  ];

  if (hasRooms && roomCount > 0) {
    tabs.push({ id: "rooms", label: `Rooms (${roomCount})` });
  }

  if (hasAmenities) {
    tabs.push({ id: "amenities", label: "Amenities" });
  }

  if (hasRoute) {
    tabs.push({ id: "route", label: "Pilgrim Route" });
  }

  // If only 1 tab exists, no need to show the segmented bar
  if (tabs.length <= 1) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              activeOpacity={0.75}
              onPress={() => onSelectTab(tab.id)}
            >
              <Text
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(107, 29, 47, 0.06)",
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
  },
  tabBtnActive: {
    backgroundColor: COLORS.sacredDeep,
  },
  tabText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.inkBody,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});
