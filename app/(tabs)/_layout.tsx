import { icons } from "@/components/ui/Icons";
import { Tabs } from "expo-router";
import { Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#EB5C49",
        tabBarLabelStyle: {
          fontSize: 11, // 🔹 control text size
          fontWeight: "600", // 🔹 control weight
          marginBottom: 6, // adjust spacing
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: insets.bottom > 0 ? insets.bottom : 12,
          left: 16,
          right: 16,
          height: 64,
          borderRadius: 16,
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
              style={{ width: 30, height: 30 }}
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
              style={{ width: 30, height: 30 }}
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
              style={{ width: 30, height: 30 }}
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
              style={{ width: 35, height: 35 }}
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
              style={{ width: 35, height: 35 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
