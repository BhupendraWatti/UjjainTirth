import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomPriceCol}>
        <Text style={styles.bottomPriceLabel} numberOfLines={1}>
          {selectedTier ? selectedTier.title : "Starting Dakshina"}
        </Text>
        <View style={styles.bottomPriceRow}>
          {activePrice ? (
            <>
              <Text style={styles.bottomCurrency}>₹</Text>
              <Text style={styles.bottomAmount}>
                {activePrice.toLocaleString("en-IN")}
              </Text>
            </>
          ) : (
            <Text style={styles.bottomCustomPrice}>As per Vidhi</Text>
          )}
        </View>
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.callIconBtn}
          onPress={onCall}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Call temple coordinator"
        >
          <Ionicons name="call" size={18} color={COLORS.primaryDeep} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={onBook}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Book Pooja via WhatsApp"
        >
          <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
          <Text style={styles.whatsappBtnText}>Book Pooja</Text>
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
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
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
    maxWidth: "48%",
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
    gap: 10,
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
  },
  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    ...SHADOWS.subtle,
  },
  whatsappBtnText: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
