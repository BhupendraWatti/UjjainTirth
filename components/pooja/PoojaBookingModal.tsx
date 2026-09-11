import { PoojaItem } from "@/types/pooja";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  item: PoojaItem | null;
  onClose: () => void;
}

const SUPPORT_PHONE = "+919425091211";

const PoojaBookingModal = ({ visible, item, onClose }: Props) => {
  if (!item) return null;

  const handleWhatsApp = () => {
    const priceText = item.starting_price
      ? `₹${item.starting_price.toLocaleString("en-IN")}`
      : "As per Vidhi";

    const text = encodeURIComponent(
      `Jai Shri Mahakal! 🙏\n\nI would like to book the following sacred pooja:\n*Ritual:* ${item.title}\n*Temple:* ${item.temple}\n*Duration:* ${item.duration}\n*Dakshina:* ${priceText}\n\nPlease guide me through the Sankalp date, required Gotra details, and puja samagri.`
    );
    const url = `https://wa.me/919425091211?text=${text}`;
    Linking.openURL(url).catch((err) =>
      console.warn("Could not open WhatsApp:", err)
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch((err) =>
      console.warn("Could not make call:", err)
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.sheetTitle}>Request Vedic Pooja</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityLabel="Close modal"
                >
                  <Ionicons name="close" size={20} color="#4A4A4A" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Ritual Summary */}
                <View style={styles.summaryCard}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />
                  <View style={styles.summaryDetails}>
                    <Text style={styles.summaryTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.summaryTemple} numberOfLines={1}>
                      📍 {item.temple}
                    </Text>
                    <Text style={styles.summaryDuration}>
                      ⏱ {item.duration}
                    </Text>
                    {item.starting_price ? (
                      <Text style={styles.summaryPrice}>
                        Dakshina: ₹{item.starting_price.toLocaleString("en-IN")}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Purpose Note */}
                <Text style={styles.purposeText}>{item.short_purpose}</Text>

                {/* Vedic Guarantees Box */}
                <View style={styles.guaranteeBox}>
                  <Text style={styles.guaranteeTitle}>Pooja Seva Includes:</Text>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#922C45" />
                    <Text style={styles.guaranteeItem}>
                      Individual Vedic Sankalp with Yajman name & Gotra
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#922C45" />
                    <Text style={styles.guaranteeItem}>
                      Pure Puja Samagri & sacred offerings provided by temple
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#922C45" />
                    <Text style={styles.guaranteeItem}>
                      Photos & Video darshan shared directly on WhatsApp
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#922C45" />
                    <Text style={styles.guaranteeItem}>
                      Consecrated Mahakal Prasad dispatched to home address
                    </Text>
                  </View>
                </View>

                {/* CTAs */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    activeOpacity={0.8}
                    onPress={handleWhatsApp}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.whatsappText}>Book Pooja on WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callButton}
                    activeOpacity={0.8}
                    onPress={handleCall}
                  >
                    <Ionicons name="call-outline" size={18} color="#922C45" />
                    <Text style={styles.callText}>Talk to Vedic Pandit Coordinator</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default memo(PoojaBookingModal);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222222",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgStone,
  },
  summaryDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.regular,
    color: COLORS.ink,
    marginBottom: 2,
  },
  summaryTemple: {
    fontSize: 12,
    color: COLORS.sacred,
    fontFamily: FONTS.body.bold,
    marginBottom: 2,
  },
  summaryDuration: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginBottom: 2,
  },
  summaryPrice: {
    fontSize: 13,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
  },
  purposeText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 19,
    marginBottom: 16,
  },
  guaranteeBox: {
    backgroundColor: COLORS.sacredTint,
    borderRadius: RADIUS.sm,
    padding: 14,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    marginBottom: 4,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  guaranteeItem: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    flex: 1,
    lineHeight: 17,
  },
  actionButtons: {
    gap: 10,
  },
  whatsappButton: {
    backgroundColor: COLORS.whatsapp,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.sm,
    shadowColor: COLORS.whatsapp,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  whatsappText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.body.bold,
  },
  callButton: {
    backgroundColor: COLORS.primaryTint,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADIUS.sm,
  },
  callText: {
    color: COLORS.primaryDeep,
    fontSize: 14,
    fontFamily: FONTS.body.bold,
  },
});
