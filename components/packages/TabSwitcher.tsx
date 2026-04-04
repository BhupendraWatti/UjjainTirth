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

export default function TabSwitcher({ tabs, active, onChange }: Props) {
  const translateX = useSharedValue(0);
  const [tabWidth, setTabWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width / tabs.length;
    setTabWidth(width);

    const index = tabs.findIndex((t) => t.value === active);
    translateX.value = index * width;
  };

  const handlePress = (index: number, value: PackageTab) => {
    translateX.value = withTiming(index * tabWidth, {
      duration: 250,
    });
    onChange(value);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {/* Sliding Background */}
      <Animated.View
        style={[styles.slider, { width: tabWidth }, animatedStyle]}
      />

      {tabs.map((tab: Tab, index) => {
        const isActive = active === tab.value;

        return (
          <TouchableOpacity
            key={tab.value}
            style={styles.tab}
            onPress={() => handlePress(index, tab.value)}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3E3DF",
    borderRadius: 30,
    padding: 0,
    overflow: "hidden",
    marginBottom: 3,
  },

  slider: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#EB5C49",
    borderRadius: 30,
    elevation: 3,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 4,
  },

  text: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
