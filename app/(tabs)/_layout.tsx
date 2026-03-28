import { icons } from "@/components/ui/Icons";
import { Tabs } from "expo-router";
import { Image } from "react-native"; // ✅ MISSING IMPORT

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#EB5C49",

        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 15,
          right: 15,
          height: 65,
          borderRadius: 20,
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
              style={{ width: 22, height: 22 }}
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
              style={{ width: 22, height: 22 }}
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
              style={{ width: 22, height: 22 }}
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
              style={{ width: 22, height: 22 }}
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
              style={{ width: 22, height: 22 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
