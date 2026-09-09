import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

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
            <Ionicons name="log-out-outline" size={20} color="#999" />
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
          <Ionicons name="shield-checkmark" size={14} color="#2E7D32" />
          <Text style={styles.authenticatedText}>Verified Pilgrimage Account</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  textBlock: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  logoutIconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F7F5F2",
  },
  loginBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  loginText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  authenticatedBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F8E9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  authenticatedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },
});
