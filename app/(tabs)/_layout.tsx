import { icons } from "@/components/ui/Icons";
import { Tabs } from "expo-router";
import { Image } from "react-native"; // ✅ MISSING IMPORT

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#EB5C49",
        tabBarLabelStyle: {
          fontSize: 12, // 🔹 control text size
          fontWeight: "600", // 🔹 control weight (500, 600, 700)
          marginTop: 0, // optional: adjust spacing
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 15,
          right: 15,
          height: 70,
          borderRadius: 0,
          backgroundColor: "#fff",
          elevation: 10,
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
        name="packages/index"
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
