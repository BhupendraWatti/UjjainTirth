import { COLORS } from "@/constants/colors";
import { PackageTab } from "@/types/tab";
import { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Tab {
  label: string;
  value: PackageTab;
}
interface Props {
  tabs: Tab[];
  active: PackageTab;
  onChange: (val: PackageTab) => void;
}

const TIMING_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export default function TabSwitcher({ tabs, active, onChange }: Props) {
  const translateX = useSharedValue(0);
  const [tabWidth, setTabWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const totalWidth = e.nativeEvent.layout.width;
    const singleTabWidth = totalWidth / tabs.length;
    setTabWidth(singleTabWidth);
    setContainerWidth(totalWidth);

    // Set initial position based on active tab
    const index = tabs.findIndex((t) => t.value === active);
    translateX.value = index * singleTabWidth;
  };

  const handlePress = (index: number, value: PackageTab) => {
    translateX.value = withTiming(index * tabWidth, TIMING_CONFIG);
    onChange(value);
  };

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={handleLayout}>
        {/* Animated slider pill */}
        <Animated.View
          style={[styles.slider, { width: tabWidth }, sliderStyle]}
        />

        {/* Tab buttons */}
        {tabs.map((tab: Tab, index) => {
          const isActive = active === tab.value;

          return (
            <TouchableOpacity
              key={tab.value}
              activeOpacity={0.7}
              style={styles.tab}
              onPress={() => handlePress(index, tab.value)}
            >
              <Animated.Text
                style={[styles.text, isActive && styles.activeText]}
              >
                {tab.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#F0E6E4",
    borderRadius: 14,
    padding: 4,
    overflow: "hidden",
    position: "relative",
  },

  slider: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 11,
    // iOS shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android shadow
    elevation: 6,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    zIndex: 1,
  },

  text: {
    fontSize: 13,
    color: "#8B6B66",
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  activeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
