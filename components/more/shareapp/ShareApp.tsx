import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ShareContentData } from "@/services/shareServices";

interface ShareAppProps {
  shareMessage: string;
  shareData?: ShareContentData;
}

export default function ShareApp({ shareMessage, shareData }: ShareAppProps) {
  const handleShare = async () => {
    // Use title + description + CTA + link (URL enables preview in WhatsApp/Instagram)
    const title = shareData?.title || "Ujjain Tirth";
    const description = shareData?.description || "";
    const cta = shareData?.cta || "";
    const link = shareData?.link || "";

    // Build message: Title -> Description -> CTA -> Link
    // Link is passed separately as 'url' for proper preview
    let message = title;
    if (description) message += `\n\n${description}`;
    if (cta) message += `\n\n${cta}`;

    // Share with url - this enables WhatsApp/Instagram to fetch OG preview
    await Share.share({
      message: message,
      url: link, // This makes the link preview work in social apps
    });
  };

  return (
    <View style={styles.card}>
      {/* Header: Icon + Text */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="share-social-outline" size={22} color={COLORS.primary} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Share App</Text>
          <Text style={styles.subtitle}>
            Share Ujjain Tirth with your friends and family
          </Text>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareBtn}
        activeOpacity={0.8}
        onPress={handleShare}
      >
        <Ionicons name="share-outline" size={18} color="#FFF" />
        <Text style={styles.shareText}>Share Now</Text>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    marginBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FBF0EE",
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
    fontSize: 12,
    color: "#999",
    fontWeight: "400",
  },

  shareBtn: {
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

  shareText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
