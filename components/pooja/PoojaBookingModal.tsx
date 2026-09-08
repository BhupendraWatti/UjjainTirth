import { PoojaItem } from "@/types/pooja";
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
    backgroundColor: "#FDF8F3",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F7EADB",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5D9CE",
  },
  summaryDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
    marginBottom: 2,
  },
  summaryTemple: {
    fontSize: 12,
    color: "#922C45",
    fontWeight: "600",
    marginBottom: 2,
  },
  summaryDuration: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 2,
  },
  summaryPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B45309",
  },
  purposeText: {
    fontSize: 13,
    color: "#555555",
    lineHeight: 19,
    marginBottom: 16,
  },
  guaranteeBox: {
    backgroundColor: "#FAF5F6",
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0E1E4",
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#922C45",
    marginBottom: 4,
  },
  guaranteeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  guaranteeItem: {
    fontSize: 12,
    color: "#4A3B40",
    flex: 1,
    lineHeight: 17,
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
    backgroundColor: "#FBF3F4",
    borderWidth: 1.5,
    borderColor: "#922C45",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  callText: {
    color: "#922C45",
    fontSize: 14,
    fontWeight: "700",
  },
});
