import { NarmadaLocationItem, ParikramaModeItem } from "@/types/parikrama";
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
  mode: ParikramaModeItem | null;
  location: NarmadaLocationItem | null;
  onClose: () => void;
}

const SUPPORT_PHONE = "+919425091211";

const ParikramaEnquiryModal = ({
  visible,
  mode,
  location,
  onClose,
}: Props) => {
  if (!mode && !location) return null;

  const title = mode ? mode.title : location ? location.title : "Narmada Parikrama Yatra";
  const image = mode ? mode.image : location?.image || "";
  const subtitle = mode
    ? `${mode.duration} • ${mode.distance}`
    : location
    ? `Stage ${location.route_order} • ${location.region}`
    : "";
  const description = mode ? mode.short_description : location?.short_description || "";

  const handleWhatsApp = () => {
    const context = mode
      ? `*Parikrama Mode:* ${mode.title}\n*Duration:* ${mode.duration}\n*Distance:* ${mode.distance}`
      : location
      ? `*Pilgrimage Stop:* ${location.title} (Stage ${location.route_order}, ${location.region})`
      : "*Inquiry:* Narmada Parikrama Yatra";

    const text = encodeURIComponent(
      `Narmade Har! 🙏\n\nI want to plan my sacred Narmada Parikrama pilgrimage.\n${context}\n\nPlease share the detailed day-wise itinerary, vehicle & ashram stay arrangements, and upcoming yatra dates.`
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
                <Text style={styles.sheetTitle}>Narmada Parikrama Seva</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  accessibilityLabel="Close modal"
                >
                  <Ionicons name="close" size={20} color="#4A4A4A" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Yatra Summary Card */}
                <View style={styles.summaryCard}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.thumbnail}
                      contentFit="cover"
                    />
                  ) : null}
                  <View style={styles.summaryDetails}>
                    <Text style={styles.summaryTitle} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.summarySub}>{subtitle}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {mode ? "YATRA PACKAGE" : "SACRED STOP"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.descriptionText}>{description}</Text>

                {/* Inclusions Box */}
                <View style={styles.inclusionsBox}>
                  <Text style={styles.inclusionsTitle}>Yatra Assistance Includes:</Text>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#088395" />
                    <Text style={styles.inclusionText}>
                      Dedicated AC vehicle (Innova / Tempo) suited for Ghat routes
                    </Text>
                  </View>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#088395" />
                    <Text style={styles.inclusionText}>
                      Pre-verified Ashram, Dharamshala & Hotel night halts
                    </Text>
                  </View>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#088395" />
                    <Text style={styles.inclusionText}>
                      Assistance for Holy Snan, Narmada Jal Sankalp & Aarti vidhi
                    </Text>
                  </View>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color="#088395" />
                    <Text style={styles.inclusionText}>
                      Boat crossing assistance at Narmada Sagar Sangam (Bharuch)
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
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
                    <Ionicons name="call-outline" size={18} color="#088395" />
                    <Text style={styles.callText}>Talk to Yatra Guide</Text>
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

export default memo(ParikramaEnquiryModal);

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
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  thumbnail: {
    width: 80,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#CCFBF1",
  },
  summaryDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#134E4A",
    marginBottom: 2,
  },
  summarySub: {
    fontSize: 12,
    color: "#0F766E",
    fontWeight: "600",
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#0D9488",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
    marginBottom: 16,
  },
  inclusionsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inclusionsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#088395",
    marginBottom: 4,
  },
  inclusionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  inclusionText: {
    fontSize: 12,
    color: "#334155",
    flex: 1,
    lineHeight: 16,
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
    backgroundColor: "#F0FDFA",
    borderWidth: 1.5,
    borderColor: "#088395",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  callText: {
    color: "#088395",
    fontSize: 14,
    fontWeight: "700",
  },
});
