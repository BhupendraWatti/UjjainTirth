import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { icons } from "@/components/ui/Icons";
// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
        screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        tabBarActiveTintColor: '#EB5C49', // your brand color
        tabBarInactiveTintColor: '#777',
  }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused ? icons.home.active : icons.home.inactive
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Temple"
        options={{
          title: "Temple",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
               focused ? icons.temple.active : icons.temple.inactive
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
