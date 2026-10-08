import MenuItem from "@/components/ui/MenuItem";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
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
    route: "/help-support?tab=contact",
  },
  {
    title: "About Us",
    icon: "information-circle-outline" as const,
    route: "/about-us",
  },
  {
    title: "About Ujjain",
    icon: "trail-sign-outline" as const,
    route: "/coming-soon",
  },
  // Language section hidden for now as requested
  // {
  //   title: "Language",
  //   icon: "globe-outline" as const,
  //   route: "/coming-soon",
  // },
  {
    title: "Help & Support",
    icon: "help-circle-outline" as const,
    route: "/help-support?tab=help",
  },
  {
    title: "Privacy Policy",
    icon: "shield-checkmark-outline" as const,
    route: "/privacy-policy",
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
});
