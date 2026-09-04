import { icons } from "@/components/ui/Icons";
import { Tabs } from "expo-router";
import { Image, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const iconSize = isCompact ? 23 : 30;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#EB5C49",
        tabBarLabelStyle: {
          fontSize: isCompact ? 9 : 11,
          fontWeight: "600", // 🔹 control weight
          marginBottom: isCompact ? 2 : 6,
        },
        tabBarIconStyle: {
          marginTop: isCompact ? 0 : 4,
        },
        tabBarStyle: {
          height: (isCompact ? 56 : 64) + insets.bottom,
          paddingBottom: insets.bottom,
          marginHorizontal: isCompact ? 0 : 16,
          marginBottom: isCompact ? 0 : 12,
          borderRadius: isCompact ? 0 : 16,
          backgroundColor: "#fff",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.04)",
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.home.active : icons.home.inactive}
              style={{ width: iconSize, height: iconSize }}
            />
          ),
        }}
      />

      {/* TEMPLES */}
      <Tabs.Screen
        name="temples"
        options={{
          title: "Temples",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.temple.active : icons.temple.inactive}
              style={{ width: iconSize, height: iconSize }}
            />
          ),
        }}
      />

      {/* PACKAGES */}
      <Tabs.Screen
        name="packages"
        options={{
          title: "Packages",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.packages.active : icons.packages.inactive}
              style={{ width: iconSize, height: iconSize }}
            />
          ),
        }}
      />

      {/* PUJA */}
      <Tabs.Screen
        name="puja"
        options={{
          title: "Puja",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.puja.active : icons.puja.inactive}
              style={{ width: iconSize, height: iconSize }}
            />
          ),
        }}
      />

      {/* MORE */}
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? icons.more.active : icons.more.inactive}
              style={{ width: iconSize, height: iconSize }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
