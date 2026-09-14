import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaDakshinaTier, PoojaItem } from "@/types/pooja";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { memo, useCallback } from "react";
import {
  Linking,
  Modal,
  Platform,
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
  selectedTier?: PoojaDakshinaTier | null;
}

const PoojaBookingModal = ({ visible, item, onClose, selectedTier }: Props) => {
  const activePrice = selectedTier && selectedTier.price !== null
    ? selectedTier.price
    : item?.starting_price ?? null;

  const handleWhatsApp = useCallback(() => {
    if (!item) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const priceText = activePrice
      ? `₹${activePrice.toLocaleString("en-IN")}`
      : "As per Vidhi";

    const packageLine = selectedTier
      ? `*Package:* ${selectedTier.title} (${priceText})\n`
      : `*Dakshina:* ${priceText}\n`;

    const text = encodeURIComponent(
      `Jai Shri Mahakal! 🙏\n\nI would like to book the following sacred pooja in Ujjain:\n*Ritual:* ${item.title}\n*Temple:* ${item.temple}\n*Duration:* ${item.duration}\n${packageLine}*Muhurat:* ${item.muhurat_timings || "Daily Morning"}\n\nPlease guide me through the auspicious muhurat, required Gotra details, and puja samagri.`
    );
    const cleanPhone = (APP_CONFIG.SUPPORT_PHONE || "+919179187199").replace(
      /[^0-9]/g,
      ""
    );
    const url = `https://wa.me/${cleanPhone}?text=${text}`;
    Linking.openURL(url).catch((err) =>
      console.warn("Could not open WhatsApp:", err)
    );
  }, [item, activePrice, selectedTier]);

  const handleCall = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const phone = APP_CONFIG.SUPPORT_PHONE || "+919179187199";
    Linking.openURL(`tel:${phone}`).catch((err) =>
      console.warn("Could not make call:", err)
    );
  }, []);

  const handleClose = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  }, [onClose]);

  if (!item) return null;

  const displayImage =
    item.image && typeof item.image === "string" && item.image.trim() !== ""
      ? item.image.trim()
      : "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.sheetTitle}>Request Vedic Pooja</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  accessibilityLabel="Close modal"
                >
                  <Ionicons name="close" size={20} color={COLORS.ink} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Ritual Summary */}
                <View style={styles.summaryCard}>
                  <Image
                    source={{ uri: displayImage }}
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
                    {selectedTier ? (
                      <View style={styles.tierSelectionPill}>
                        <Ionicons name="bookmark" size={12} color={COLORS.sacred} />
                        <Text style={styles.tierSelectionText} numberOfLines={1}>
                          {selectedTier.title}: ₹{selectedTier.price?.toLocaleString("en-IN") || "Custom"}
                        </Text>
                      </View>
                    ) : item.starting_price ? (
                      <Text style={styles.summaryPrice}>
                        Starting Dakshina: ₹
                        {item.starting_price.toLocaleString("en-IN")}
                      </Text>
                    ) : (
                      <Text style={styles.summaryPrice}>
                        Dakshina as per Vidhi
                      </Text>
                    )}
                  </View>
                </View>

                {/* Purpose Note */}
                <Text style={styles.purposeText}>{item.short_purpose}</Text>

                {/* Genuine What UjjainTirth Provides Box */}
                <View style={styles.guaranteeBox}>
                  <Text style={styles.guaranteeTitle}>What UjjainTirth Provides:</Text>
                  {item.what_we_provide && item.what_we_provide.length > 0 ? (
                    item.what_we_provide.map((prov, pIdx) => {
                      const iconName =
                        prov.icon === "ribbon"
                          ? "ribbon-outline"
                          : prov.icon === "videocam"
                          ? "videocam-outline"
                          : prov.icon === "leaf"
                          ? "leaf-outline"
                          : prov.icon === "gift"
                          ? "gift-outline"
                          : "shield-checkmark-outline";

                      return (
                        <View key={`prov-${pIdx}`} style={styles.guaranteeRow}>
                          <Ionicons
                            name={iconName as any}
                            size={16}
                            color={COLORS.sacred}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.guaranteeTitleBold}>
                              {prov.title}
                            </Text>
                            <Text style={styles.guaranteeItem}>
                              {prov.description}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <>
                      <View style={styles.guaranteeRow}>
                        <Ionicons
                          name="shield-checkmark"
                          size={16}
                          color={COLORS.sacred}
                        />
                        <Text style={styles.guaranteeItem}>
                          Individual Vedic Sankalp with Yajman name & Gotra
                        </Text>
                      </View>
                      <View style={styles.guaranteeRow}>
                        <Ionicons
                          name="shield-checkmark"
                          size={16}
                          color={COLORS.sacred}
                        />
                        <Text style={styles.guaranteeItem}>
                          Pure Puja Samagri & sacred offerings provided by temple
                        </Text>
                      </View>
                      <View style={styles.guaranteeRow}>
                        <Ionicons
                          name="shield-checkmark"
                          size={16}
                          color={COLORS.sacred}
                        />
                        <Text style={styles.guaranteeItem}>
                          Photos & Video darshan shared directly on WhatsApp
                        </Text>
                      </View>
                      <View style={styles.guaranteeRow}>
                        <Ionicons
                          name="shield-checkmark"
                          size={16}
                          color={COLORS.sacred}
                        />
                        <Text style={styles.guaranteeItem}>
                          Consecrated Mahakal Prasad dispatched to home address
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {/* CTAs */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    activeOpacity={0.8}
                    onPress={handleWhatsApp}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.whatsappText}>
                      Book Pooja on WhatsApp
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callButton}
                    activeOpacity={0.8}
                    onPress={handleCall}
                  >
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color={COLORS.primaryDeep}
                    />
                    <Text style={styles.callText}>
                      Talk to Vedic Coordinator
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ height: 24 }} />
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "85%",
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.bgStone,
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceMuted,
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
    width: 82,
    height: 82,
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
    fontFamily: FONTS.display.semiBold,
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
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.15)",
  },
  guaranteeTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    marginBottom: 2,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  tierSelectionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  tierSelectionText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  guaranteeTitleBold: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginBottom: 2,
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
    ...SHADOWS.subtle,
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
