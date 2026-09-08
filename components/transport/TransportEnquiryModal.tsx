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
                  <Ionicons name="close" size={20} color="#4A4A4A" />
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
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    <Text style={styles.guaranteeText}>
                      Experienced local drivers familiar with temple routes
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    <Text style={styles.guaranteeText}>
                      Door-to-door pickup from Ujjain Station, Airport, or Hotel
                    </Text>
                  </View>
                  <View style={styles.guaranteeRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
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
                    <Ionicons name="call-outline" size={18} color="#EB5C49" />
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
  vehicleSummary: {
    flexDirection: "row",
    backgroundColor: "#FAF7F2",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EFEBE3",
  },
  vehicleThumbnail: {
    width: 80,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#E2DCD2",
  },
  vehicleDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 2,
  },
  vehicleSub: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#F0EAE1",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#7C6339",
  },
  guaranteeBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guaranteeText: {
    fontSize: 12,
    color: "#166534",
    flex: 1,
    lineHeight: 16,
  },
  descriptionText: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    gap: 10,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#25D366",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  whatsappText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  callButton: {
    backgroundColor: "#FFF5F2",
    borderWidth: 1.5,
    borderColor: "#EB5C49",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  callText: {
    color: "#EB5C49",
    fontSize: 14,
    fontWeight: "700",
  },
});
