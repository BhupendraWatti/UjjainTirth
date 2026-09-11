import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserCardProps {
  /** Whether the user is logged in (optional override) */
  isLoggedIn?: boolean;
  /** Display name when logged in (optional override) */
  userName?: string;
  /** Subtitle text when logged in (optional override) */
  userEmail?: string;
}

export default function UserCard({
  isLoggedIn: propIsLoggedIn,
  userName: propUserName,
  userEmail: propUserEmail,
}: UserCardProps) {
  const { user, isAuthenticated, logout } = useAuth();

  const loggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : isAuthenticated;
  const name = propUserName || user?.name || (loggedIn ? "Yatri" : "Welcome");
  const subText =
    propUserEmail ||
    (loggedIn
      ? `${user?.mobile || ""}${user?.city ? ` • ${user.city}` : ""}`
      : "Sign in to unlock all pilgrimage features");

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out from UjjainTirth?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      {/* Avatar + Info */}
      <View style={styles.infoRow}>
        <View style={styles.avatar}>
          <Ionicons
            name={loggedIn ? "person" : "person-outline"}
            size={22}
            color="#FFF"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subtitle}>{subText}</Text>
        </View>

        {loggedIn && (
          <TouchableOpacity
            style={styles.logoutIconBtn}
            onPress={handleLogout}
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.inkMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* CTA Button */}
      {!loggedIn ? (
        <TouchableOpacity
          style={styles.loginBtn}
          activeOpacity={0.8}
          onPress={() => router.push("/(auth)/login" as any)}
          accessibilityRole="button"
          accessibilityLabel="Login or Sign Up"
        >
          <Ionicons name="log-in-outline" size={18} color="#FFF" />
          <Text style={styles.loginText}>Login / Sign Up via SMS</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.authenticatedBadgeRow}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.success} />
          <Text style={styles.authenticatedText}>Verified Pilgrimage Account</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.subtle,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  logoutIconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.bgStone,
  },
  loginBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...SHADOWS.subtle,
  },
  loginText: {
    color: "#FFF",
    fontFamily: FONTS.body.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  authenticatedBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.surfaceMuted,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
  },
  authenticatedText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.success,
  },
});
