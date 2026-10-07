import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { NarmadaLocationItem, ParikramaModeItem } from "@/types/parikrama";
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
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";

interface Props {
  visible: boolean;
  mode: ParikramaModeItem | null;
  location: NarmadaLocationItem | null;
  onClose: () => void;
}

const SUPPORT_PHONE = "+919425091211";

const INCLUSIONS = [
  {
    icon: "car-outline" as const,
    title: "Dedicated Ghats Vehicle",
    desc: "AC Innova / Tempo Traveller with drivers experienced in coastal & ghat terrain.",
  },
  {
    icon: "bed-outline" as const,
    title: "Ashram & Hotel Halts",
    desc: "Pre-verified night halts at sacred river ashrams, dharamshalas & hotels.",
  },
  {
    icon: "water-outline" as const,
    title: "Sankalp & Holy Snan",
    desc: "Guided Narmada Jal Sankalp vidhi, morning ghat snan & evening aarti assistance.",
  },
  {
    icon: "boat-outline" as const,
    title: "Ocean Boat Crossing",
    desc: "Seamless boat crossing assistance at Narmada Sagar Sangam (Bharuch / Vimleshwar).",
  },
];

const ParikramaEnquiryModal = ({
  visible,
  mode,
  location,
  onClose,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isNarrowScreen = screenWidth < 360;

  // Adaptive bottom padding to respect Android 3-button navigation bar & iOS home indicator
  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 28 : 16);

  const handleClose = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onClose();
  }, [onClose]);

  if (!mode && !location) return null;

  const title = mode ? mode.title : location ? location.title : "Narmada Parikrama Yatra";
  const image = mode ? mode.image : location?.image || "";
  const subtitle = mode
    ? `${mode.duration} • ${mode.distance}`
    : location
    ? `Stage ${location.route_order} • ${location.region}`
    : "";
  const description = mode ? mode.short_description : location?.short_description || "";

  const handleWhatsApp = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const context = mode
      ? `*Parikrama Mode:* ${mode.title}\n*Duration:* ${mode.duration}\n*Distance:* ${mode.distance}`
      : location
      ? `*Pilgrimage Stop:* ${location.title} (Stage ${location.route_order}, ${location.region})`
      : "*Inquiry:* Narmada Parikrama Yatra";

    const text = encodeURIComponent(
      `नर्मदे हर! 🙏\n\nI want to plan my sacred Narmada Parikrama pilgrimage.\n${context}\n\nPlease share the detailed day-wise itinerary, vehicle & ashram stay arrangements, and upcoming yatra dates.`
    );
    const cleanPhone = SUPPORT_PHONE.replace(/[^0-9]/g, "");
    const waUrl = `whatsapp://send?phone=${cleanPhone}&text=${text}`;
    const webWaUrl = `https://wa.me/${cleanPhone}?text=${text}`;

    try {
      if (await Linking.canOpenURL(waUrl)) {
        await Linking.openURL(waUrl);
      } else {
        await Linking.openURL(webWaUrl);
      }
    } catch (err) {
      console.warn("Could not open WhatsApp:", err);
      Linking.openURL(webWaUrl).catch(() => {});
    }
  };

  const handleCall = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const phoneUrl = Platform.select({
      ios: `telprompt:${SUPPORT_PHONE}`,
      android: `tel:${SUPPORT_PHONE}`,
      default: `tel:${SUPPORT_PHONE}`,
    });
    Linking.openURL(phoneUrl).catch((err) =>
      console.warn("Could not make call:", err)
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                { paddingBottom: bottomInset + 12 },
              ]}
            >
              {/* Drag Handle */}
              <View style={styles.handle} />

              {/* Modal Top Header */}
              <View style={styles.header}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.sheetTitle} maxFontSizeMultiplier={1.3} numberOfLines={1}>
                    Narmada Parikrama Seva
                  </Text>
                  <Text style={styles.sheetSub} maxFontSizeMultiplier={1.2}>
                    ॥ नर्मदे हर ॥ Devotee Assistance Desk
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                  accessibilityLabel="Close modal"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={20} color={COLORS.inkBody} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.scrollBody}
              >
                {/* Yatra Summary Card */}
                <View style={styles.summaryCard}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.thumbnail}
                      contentFit="cover"
                      transition={200}
                      cachePolicy="memory-disk"
                    />
                  ) : null}

                  <View style={styles.summaryDetails}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText} maxFontSizeMultiplier={1.2}>
                        {mode ? "YATRA PACKAGE" : "SACRED STOP"}
                      </Text>
                    </View>

                    <Text
                      style={styles.summaryTitle}
                      numberOfLines={2}
                      maxFontSizeMultiplier={1.3}
                    >
                      {title}
                    </Text>

                    <Text style={styles.summarySub} numberOfLines={1} maxFontSizeMultiplier={1.2}>
                      {subtitle}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.descriptionText} maxFontSizeMultiplier={1.3}>
                  {description}
                </Text>

                {/* Pilgrimage Inclusions Box */}
                <View style={styles.inclusionsBox}>
                  <XStack alignItems="center" gap="$1.5" marginBottom="$2">
                    <Ionicons name="shield-checkmark" size={17} color={COLORS.journey} />
                    <Text style={styles.inclusionsTitle} maxFontSizeMultiplier={1.3}>
                      Yatra Assistance & Inclusions
                    </Text>
                  </XStack>

                  <YStack gap="$2.5">
                    {INCLUSIONS.map((item, idx) => (
                      <View key={idx} style={styles.inclusionRow}>
                        <View style={styles.inclusionIconBox}>
                          <Ionicons name={item.icon} size={15} color={COLORS.journey} />
                        </View>
                        <View style={styles.inclusionTextCol}>
                          <Text style={styles.inclusionItemTitle} maxFontSizeMultiplier={1.25}>
                            {item.title}
                          </Text>
                          <Text style={styles.inclusionText} maxFontSizeMultiplier={1.2}>
                            {item.desc}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </YStack>
                </View>

                {/* Trust & Verified Badge */}
                <View style={styles.trustBadgeRow}>
                  <Ionicons name="shield-checkmark" size={14} color={COLORS.journey} />
                  <Text style={styles.trustBadgeText} maxFontSizeMultiplier={1.2}>
                    100% Verified Ashram & Ghat Pilgrimage Guidance
                  </Text>
                </View>

                {/* High Contrast Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    activeOpacity={0.82}
                    onPress={handleWhatsApp}
                    accessibilityRole="button"
                    accessibilityLabel="Enquire on WhatsApp"
                  >
                    <Ionicons name="logo-whatsapp" size={21} color="#FFFFFF" />
                    <Text style={styles.whatsappText} maxFontSizeMultiplier={1.25}>
                      Enquire on WhatsApp
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.callButton}
                    activeOpacity={0.82}
                    onPress={handleCall}
                    accessibilityRole="button"
                    accessibilityLabel="Talk to Yatra Guide"
                  >
                    <Ionicons name="call-outline" size={19} color={COLORS.journey} />
                    <Text style={styles.callText} maxFontSizeMultiplier={1.25}>
                      Talk to Yatra Guide (+91 94250 91211)
                    </Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: "rgba(43, 36, 32, 0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "90%",
    ...SHADOWS.elevated,
  },
  handle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: COLORS.inkFaint,
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: 10,
  },
  sheetTitle: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  sheetSub: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.subtle,
  },
  scrollBody: {
    paddingBottom: 20,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.card,
  },
  thumbnail: {
    width: 84,
    height: 74,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgStone,
  },
  summaryDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: RADIUS.xs,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
    letterSpacing: 0.5,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    lineHeight: 20,
  },
  summarySub: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.journey,
    marginTop: 3,
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 19,
    marginBottom: 16,
  },
  inclusionsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  inclusionsTitle: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
  inclusionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  inclusionIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.journeyTint,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  inclusionTextCol: {
    flex: 1,
  },
  inclusionItemTitle: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  inclusionText: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 16,
    marginTop: 1,
  },
  trustBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.journeyTint,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(11, 110, 127, 0.2)",
  },
  trustBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
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
    minHeight: 50,
    ...SHADOWS.subtle,
  },
  whatsappText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: FONTS.body.bold,
  },
  callButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.journey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: RADIUS.sm,
    minHeight: 48,
  },
  callText: {
    color: COLORS.journey,
    fontSize: 13,
    fontFamily: FONTS.body.bold,
  },
});
