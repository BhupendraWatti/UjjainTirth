import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserCardProps {
  /** Whether the user is logged in */
  isLoggedIn?: boolean;
  /** Display name when logged in */
  userName?: string;
  /** Subtitle text when logged in */
  userEmail?: string;
}

export default function UserCard({
  isLoggedIn = false,
  userName = "Guest",
  userEmail,
}: UserCardProps) {
  return (
    <View style={styles.card}>
      {/* Avatar + Info */}
      <View style={styles.infoRow}>
        <View style={styles.avatar}>
          <Ionicons
            name={isLoggedIn ? "person" : "person-outline"}
            size={22}
            color="#FFF"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.name}>
            {isLoggedIn ? userName : "Welcome"}
          </Text>
          <Text style={styles.subtitle}>
            {isLoggedIn
              ? userEmail || "Manage your account"
              : "Sign in to unlock all features"}
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      {!isLoggedIn && (
        <TouchableOpacity
          style={styles.loginBtn}
          activeOpacity={0.8}
          onPress={() => router.push("/coming-soon")}
        >
          <Ionicons name="log-in-outline" size={18} color="#FFF" />
          <Text style={styles.loginText}>Login / Sign Up</Text>
        </TouchableOpacity>
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
});
