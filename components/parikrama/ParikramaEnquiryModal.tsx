import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
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
                  <Ionicons name="close" size={20} color={COLORS.inkBody} />
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
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.journey} />
                    <Text style={styles.inclusionText}>
                      Dedicated AC vehicle (Innova / Tempo) suited for Ghat routes
                    </Text>
                  </View>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.journey} />
                    <Text style={styles.inclusionText}>
                      Pre-verified Ashram, Dharamshala & Hotel night halts
                    </Text>
                  </View>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.journey} />
                    <Text style={styles.inclusionText}>
                      Assistance for Holy Snan, Narmada Jal Sankalp & Aarti vidhi
                    </Text>
                  </View>
                  <View style={styles.inclusionRow}>
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.journey} />
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
                    <Ionicons name="call-outline" size={18} color={COLORS.journey} />
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
  summaryCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  thumbnail: {
    width: 80,
    height: 70,
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
  summarySub: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.journey,
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 19,
    marginBottom: 16,
  },
  inclusionsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  inclusionsTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
    marginBottom: 4,
  },
  inclusionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  inclusionText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
    flex: 1,
    lineHeight: 16,
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
