import ScreenContainer from "@/components/layout/ScreenContainer";
import { NeedAssistance, SettingsMenuList, UserCard } from "@/components/more";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function MoreScreen() {
  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Section 1: Sign Up / Sign In ── */}
        <UserCard />

        {/* ── Section 2: Mobile Settings ── */}
        <SettingsMenuList />

        {/* ── Section 3: Need Assistance ── */}
        <NeedAssistance />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // room for bottom tab bar
  },
});
