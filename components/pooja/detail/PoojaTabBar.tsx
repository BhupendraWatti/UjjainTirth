import React, { useCallback, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";

export interface TabItem {
  key: string;
  label: string;
  subLabel: string;
}

export const POOJA_TABS: TabItem[] = [
  {
    key: "significance",
    label: "Significance",
    subLabel: "पौराणिक महत्व",
  },
  {
    key: "vidhi",
    label: "Ritual Vidhi",
    subLabel: "विधि व संकल्प",
  },
  {
    key: "packages",
    label: "Dakshina",
    subLabel: "दक्षिणा व सामग्री",
  },
];

interface PoojaTabBarProps {
  activeTab: number;
  onSelectTab: (index: number) => void;
}

export const PoojaTabBar: React.FC<PoojaTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const handleTabPress = useCallback(
    (index: number) => {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
      onSelectTab(index);
    },
    [onSelectTab]
  );

  const tabWidth = containerWidth > 0 ? (containerWidth - 8) / POOJA_TABS.length : 0;

  const indicatorStyle = useAnimatedStyle(() => {
    if (tabWidth === 0) return { opacity: 0 };
    return {
      opacity: 1,
      transform: [
        {
          translateX: withSpring(activeTab * tabWidth, {
            damping: 22,
            stiffness: 200,
          }),
        },
      ],
      width: tabWidth,
    };
  }, [activeTab, tabWidth]);

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.tabTrack} onLayout={handleLayout}>
        {/* Smooth Animated Sliding Indicator */}
        {tabWidth > 0 && (
          <Animated.View style={[styles.activeIndicator, indicatorStyle]} />
        )}

        {/* Pure Typographic Tabs without Cluttered Icons */}
        {POOJA_TABS.map((tab, idx) => {
          const isActive = activeTab === idx;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(idx)}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`${tab.label}, ${tab.subLabel}`}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              <Text
                style={[
                  styles.tabSubLabel,
                  isActive && styles.tabSubLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.subLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    marginBottom: 18,
  },
  tabTrack: {
    flexDirection: "row",
    backgroundColor: "rgba(43, 36, 32, 0.04)",
    borderRadius: RADIUS.md,
    padding: 4,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.06)",
  },
  activeIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.sacred,
    borderRadius: RADIUS.sm,
    ...SHADOWS.subtle,
    zIndex: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 6,
    zIndex: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkBody,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
  tabSubLabel: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  tabSubLabelActive: {
    color: "#FFE082",
  },
});
