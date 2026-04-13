import { COLORS } from "@/constants/colors";
import MenuItem from "@/components/ui/MenuItem";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Menu items for the "Mobile Settings" section.
 * Each item navigates to /coming-soon until the real screen is built.
 *
 * To add a new menu item, simply add an entry to the `menuItems` array.
 */
const menuItems = [
  {
    title: "My Bookings",
    icon: "calendar-outline" as const,
    route: "/coming-soon",
  },
  {
    title: "Contact Us",
    icon: "call-outline" as const,
    route: "/coming-soon",
  },
  {
    title: "About Ujjain",
    icon: "information-circle-outline" as const,
    route: "/coming-soon",
  },
  {
    title: "Language",
    icon: "globe-outline" as const,
    route: "/coming-soon",
  },
  {
    title: "Help & Support",
    icon: "help-circle-outline" as const,
    route: "/coming-soon",
  },
  {
    title: "Privacy Policy",
    icon: "shield-checkmark-outline" as const,
    route: "/coming-soon",
  },
];

export default function SettingsMenuList() {
  return (
    <View style={styles.card}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          title={item.title}
          icon={item.icon}
          onPress={() => router.push(item.route as any)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
});
