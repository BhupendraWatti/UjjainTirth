import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * "Need Assistance?" support card.
 *
 * When the user taps "Call Now", it opens the native phone dialer
 * with the number defined in `constants/appConfig.ts → SUPPORT_PHONE`.
 */
export default function NeedAssistance() {
  const handleCallNow = async () => {
    const phoneNumber = APP_CONFIG.SUPPORT_PHONE;

    // Build the tel: URL (works on both iOS and Android)
    const telUrl = Platform.select({
      ios: `telprompt:${phoneNumber}`,     // iOS shows confirmation
      android: `tel:${phoneNumber}`,        // Android opens dialer
      default: `tel:${phoneNumber}`,
    });

    try {
      const supported = await Linking.canOpenURL(telUrl);

      if (supported) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert(
          "Cannot Make Call",
          "Phone calling is not supported on this device.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error opening phone dialer:", error);
      Alert.alert(
        "Error",
        "Something went wrong while trying to make the call.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* Icon + text */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="headset-outline" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Need Assistance?</Text>
          <Text style={styles.subtitle}>
            We&apos;re here to help you 24/7
          </Text>
        </View>
      </View>

      {/* Call Now button */}
      <TouchableOpacity
        style={styles.callBtn}
        activeOpacity={0.8}
        onPress={handleCallNow}
      >
        <Ionicons name="call" size={18} color="#FFF" />
        <Text style={styles.callText}>Call Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: 14,
    ...SHADOWS.card,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },

  textBlock: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },

  callBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    ...SHADOWS.subtle,
  },

  callText: {
    color: "#FFF",
    fontFamily: FONTS.body.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
