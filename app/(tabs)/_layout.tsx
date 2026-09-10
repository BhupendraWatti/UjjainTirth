import { Tabs } from "expo-router";
import AnimatedTabBar from "@/components/navigation/AnimatedTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
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
