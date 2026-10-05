import { Tabs } from "expo-router";
import AnimatedTabBar from "@/components/navigation/AnimatedTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "transparent",
          borderTopWidth: 0,
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      {/* TEMPLES */}
      <Tabs.Screen
        name="temples"
        options={{
          title: "Temples",
        }}
      />

      {/* PACKAGES */}
      <Tabs.Screen
        name="packages"
        options={{
          title: "Packages",
        }}
      />

      {/* PUJA */}
      <Tabs.Screen
        name="puja"
        options={{
          title: "Puja",
        }}
      />

      {/* MORE */}
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
        }}
      />
    </Tabs>
  );
}
