import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
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
            We're here to help you 24/7
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
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
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
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
  },

  textBlock: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  callBtn: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  callText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
