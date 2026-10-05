import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaDakshinaTier } from "@/types/pooja";

interface PoojaBottomBarProps {
  activePrice: number | null;
  selectedTier: PoojaDakshinaTier | null;
  onCall: () => void;
  onBook: () => void;
}

export const PoojaBottomBar: React.FC<PoojaBottomBarProps> = ({
  activePrice,
  selectedTier,
  onCall,
  onBook,
}) => {
  const insets = useSafeAreaInsets();

  const handleCallWithHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCall();
  };

  const handleBookWithHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onBook();
  };

  return (
    <View
      style={[
        styles.bottomBar,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 24 : 14),
        },
      ]}
    >
      <View style={styles.bottomPriceCol}>
        <Text
          style={styles.bottomPriceLabel}
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
        >
          {selectedTier ? selectedTier.title : "Dakshina"}
        </Text>
        <View style={styles.bottomPriceRow}>
          {activePrice ? (
            <>
              <Text style={styles.bottomCurrency} maxFontSizeMultiplier={1.2}>₹</Text>
              <Text
                style={styles.bottomAmount}
                numberOfLines={1}
                maxFontSizeMultiplier={1.25}
              >
                {activePrice.toLocaleString("en-IN")}
              </Text>
            </>
          ) : (
            <Text
              style={styles.bottomCustomPrice}
              numberOfLines={1}
              maxFontSizeMultiplier={1.25}
            >
              As per Vidhi
            </Text>
          )}
        </View>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.callIconBtn}
          onPress={handleCallWithHaptic}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Call temple coordinator"
        >
          <Ionicons name="call" size={18} color={COLORS.primaryDeep} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={handleBookWithHaptic}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Book Pooja via WhatsApp"
        >
          <Ionicons name="logo-whatsapp" size={17} color="#FFFFFF" />
          <Text
            style={styles.whatsappBtnText}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.85}
          >
            {activePrice
              ? `Book • ₹${activePrice.toLocaleString("en-IN")}`
              : "Book Pooja"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOWS.card,
    zIndex: 20,
  },
  bottomPriceCol: {
    justifyContent: "center",
    flexShrink: 1,
    minWidth: 80,
    marginRight: 8,
  },
  bottomPriceLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginBottom: 1,
  },
  bottomPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bottomCurrency: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  bottomAmount: {
    fontSize: 21,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.3,
  },
  bottomCustomPrice: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flex: 1,
    flexShrink: 1,
  },
  callIconBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryTint,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(235, 92, 73, 0.3)",
    flexShrink: 0,
  },
  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: RADIUS.sm,
    flexShrink: 1,
    ...SHADOWS.subtle,
  },
  whatsappBtnText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
