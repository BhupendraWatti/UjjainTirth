import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
  const { width: screenWidth } = useWindowDimensions();
  const isCompact = screenWidth < 375;

  // Safe bottom padding handling 3-button navigation (48-56dp), gesture bar, or legacy devices
  const bottomPadding = insets.bottom > 0
    ? insets.bottom + (Platform.OS === "android" ? 6 : 4)
    : (Platform.OS === "ios" ? 22 : 14);

  const handleCallWithHaptic = () => {
    if (Platform.OS !== "web") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {}
    }
    onCall();
  };

  const handleBookWithHaptic = () => {
    if (Platform.OS !== "web") {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    onBook();
  };

  const bookLabel = activePrice
    ? `Book • ₹${activePrice.toLocaleString("en-IN")}`
    : "Book Pooja";

  return (
    <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
      {/* Price & Tier Summary Column */}
      <View style={styles.bottomPriceCol}>
        <Text
          style={styles.bottomPriceLabel}
          numberOfLines={1}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.15}
        >
          {selectedTier ? selectedTier.title : "Dakshina"}
        </Text>
        <View style={styles.bottomPriceRow}>
          {activePrice ? (
            <>
              <Text style={styles.bottomCurrency} maxFontSizeMultiplier={1.15}>
                ₹
              </Text>
              <Text
                style={styles.bottomAmount}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                maxFontSizeMultiplier={1.15}
              >
                {activePrice.toLocaleString("en-IN")}
              </Text>
            </>
          ) : (
            <Text
              style={styles.bottomCustomPrice}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              maxFontSizeMultiplier={1.15}
            >
              As per Vidhi
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons Column */}
      <View style={[styles.bottomActions, { gap: isCompact ? 6 : 8 }]}>
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
          style={[
            styles.whatsappBtn,
            isCompact && styles.whatsappBtnCompact,
          ]}
          onPress={handleBookWithHaptic}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Book Pooja via WhatsApp"
        >
          <Ionicons name="logo-whatsapp" size={17} color="#FFFFFF" />
          <Text
            style={styles.whatsappBtnText}
            numberOfLines={1}
            maxFontSizeMultiplier={1.15}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {bookLabel}
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
    paddingHorizontal: 16,
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
    flexGrow: 0,
    minWidth: 0,
    maxWidth: "46%",
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
    flexShrink: 1,
    flexGrow: 1,
  },
  callIconBtn: {
    width: 44,
    height: 44,
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
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: RADIUS.sm,
    minHeight: 44,
    flexShrink: 1,
    flexGrow: 1,
    ...SHADOWS.subtle,
  },
  whatsappBtnCompact: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 5,
  },
  whatsappBtnText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
