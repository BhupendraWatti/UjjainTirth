import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { TransportServiceItem } from "@/types/transport";
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
  item: TransportServiceItem | null;
  onClose: () => void;
}

const SUPPORT_PHONE = "+919425091211";

const TransportEnquiryModal = ({ visible, item, onClose }: Props) => {
  if (!item) return null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Namaste, I want to book transport for Ujjain pilgrimage:\n\n*Vehicle:* ${item.title} (${item.vehicle_type})\n*Capacity:* ${item.passenger_capacity} Passengers\n\nPlease let me know availability and tariff.`
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
              {/* Drag indicator / handle */}
              <View style={styles.handle} />

              <View style={styles.header}>
                <Text style={styles.sheetTitle}>Book Transport</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityLabel="Close modal"
                >
                  <Ionicons name="close" size={20} color={COLORS.inkBody} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Vehicle Mini Card */}
                <View style={styles.vehicleSummary}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.vehicleThumbnail}
                    contentFit="cover"
                  />
                  <View style={styles.vehicleDetails}>
                    <Text style={styles.vehicleName} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.vehicleSub}>
                      {item.vehicle_type} • {item.passenger_capacity} Seater
                    </Text>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        Category: {item.service_category.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Pilgrimage Guarantees */}
                <View style={styles.guaranteeBox}>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    <Text style={styles.guaranteeText}>
                      Experienced local drivers familiar with temple routes
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    <Text style={styles.guaranteeText}>
                      Door-to-door pickup from Ujjain Station, Airport, or Hotel
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    <Text style={styles.guaranteeText}>
                      Transparent pricing with zero hidden charges
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.descriptionText}>
                  {item.short_description}
                </Text>

                {/* CTAs */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    activeOpacity={0.8}
                    onPress={handleWhatsApp}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
                    <Text style={styles.whatsappText}>Enquire on WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callButton}
                    activeOpacity={0.8}
                    onPress={handleCall}
                  >
                    <Ionicons name="call-outline" size={18} color={COLORS.journey} />
                    <Text style={styles.callText}>Call Support Helpdesk</Text>
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

export default memo(TransportEnquiryModal);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(43, 36, 32, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.inkFaint,
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
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleSummary: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  vehicleThumbnail: {
    width: 80,
    height: 64,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgStone,
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  vehicleName: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 2,
  },
  vehicleSub: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginBottom: 4,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  tagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
  guaranteeBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guaranteeText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
    flex: 1,
    lineHeight: 16,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 20,
    marginBottom: 20,
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
    backgroundColor: COLORS.journeyTint,
    borderWidth: 1.5,
    borderColor: COLORS.journey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADIUS.sm,
  },
  callText: {
    color: COLORS.journey,
    fontSize: 14,
    fontFamily: FONTS.body.bold,
  },
});
