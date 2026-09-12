import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { PackageTab } from "@/types/tab";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Tab {
  label: string;
  value: PackageTab;
  badge?: string;
}

interface Props {
  tabs: Tab[];
  active: PackageTab;
  onChange: (val: PackageTab) => void;
}

// Swiggy/Zomato style spring configuration for bouncy, tactile feedback
const SPRING_CONFIG = {
  damping: 18,
  stiffness: 180,
  mass: 0.8,
};

export default function TabSwitcher({ tabs, active, onChange }: Props) {
  const translateX = useSharedValue(0);
  const [tabWidth, setTabWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const containerWidth = e.nativeEvent.layout.width;
    const singleTabWidth = (containerWidth - 8) / tabs.length;
    setTabWidth(singleTabWidth);

    const index = tabs.findIndex((t) => t.value === active);
    if (index >= 0) {
      translateX.value = index * singleTabWidth;
    }
  };

  const handlePress = (index: number, value: PackageTab) => {
    if (value === active) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateX.value = withSpring(index * tabWidth, SPRING_CONFIG);
    onChange(value);
  };

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.outerWrapper}>
      {/* Floating Segmented Pill Island */}
      <View style={styles.islandContainer} onLayout={handleLayout}>
        {/* Animated Sliding Pill with Dynamic Saffron Glow */}
        {tabWidth > 0 && (
          <Animated.View
            style={[styles.activeSlider, { width: tabWidth }, sliderStyle]}
          />
        )}

        {/* Tab Buttons */}
        {tabs.map((tab: Tab, index) => {
          const isActive = active === tab.value;

          return (
            <Pressable
              key={tab.value}
              onPress={() => handlePress(index, tab.value)}
              style={styles.tabButton}
              accessible={true}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label} tab`}
            >
              <View style={styles.tabContentRow}>
                <Text
                  style={[
                    styles.tabLabel,
                    isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>

                {/* Optional Swiggy/Zomato micro-badge */}
                {tab.badge ? (
                  <View
                    style={[
                      styles.microBadge,
                      isActive ? styles.activeMicroBadge : styles.inactiveMicroBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.microBadgeText,
                        isActive
                          ? styles.activeMicroBadgeText
                          : styles.inactiveMicroBadgeText,
                      ]}
                    >
                      {tab.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },

  // Swiggy/Zomato Floating Island Container
  islandContainer: {
    flexDirection: "row",
    backgroundColor: "#EFE8DC",
    borderRadius: 24,
    padding: 4,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.08)",
    // Soft organic floating shadow
    shadowColor: "#2B2420",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  activeSlider: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    // Vibrant warm saffron glow shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.38,
    shadowRadius: 7,
    elevation: 4,
  },

  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    zIndex: 2,
  },

  tabContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  tabLabel: {
    fontSize: 13.5,
    letterSpacing: 0.15,
  },

  activeTabLabel: {
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },

  inactiveTabLabel: {
    fontFamily: FONTS.body.semiBold,
    color: "#5C5248",
  },

  // Micro pill badge (e.g. "Curated" / "Custom")
  microBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },

  activeMicroBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },

  inactiveMicroBadge: {
    backgroundColor: "rgba(43, 36, 32, 0.08)",
  },

  microBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  activeMicroBadgeText: {
    color: "#FFFFFF",
  },

  inactiveMicroBadgeText: {
    color: "#7A7167",
  },
});
