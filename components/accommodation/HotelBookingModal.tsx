import { EnrichedHotel } from "@/utils/accommodationAdapter";
import { RoomTier } from "@/types/service";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { APP_CONFIG } from "@/constants/appConfig";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "@/components/ui/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HIT_SLOP } from "@/constants/layout";
import { COLORS } from "@/constants/colors";
interface Props {
  visible: boolean;
  hotel: EnrichedHotel | null;
  selectedRoom: RoomTier | null;
  onClose: () => void;
}

export default function HotelBookingModal({
  visible,
  hotel,
  selectedRoom,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [nights, setNights] = useState(2);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [darshanAssistance, setDarshanAssistance] = useState(true);

  if (!hotel) return null;

  const activeRoom = selectedRoom || (hotel.rooms.length > 0 ? hotel.rooms[0] : null);
  const roomPrice = activeRoom ? activeRoom.price : hotel.price;
  const totalPayable = roomPrice * nights;

  const handleConfirmBooking = async () => {
    const phoneDigits = phone.replace(/\D/g, "");
    if (!fullName.trim() || phoneDigits.length < 10) {
      Alert.alert(
        "Devotee Details Required",
        "Please enter your full name and a valid phone/WhatsApp number for your booking voucher."
      );
      return;
    }

    const roomTitle = activeRoom ? activeRoom.title : (hotel.category ? `${hotel.category.toUpperCase()} Stay` : "Standard Stay");
    const distanceInfo = hotel.distance_to_mahakal ? ` (${hotel.distance_to_mahakal})` : "";

    const message =
      `*Jai Shri Mahakal!*\n\n` +
      `*New Accommodation Booking Request*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏨 *Stay:* ${hotel.name}\n` +
      `📍 *Location:* ${hotel.location}${distanceInfo}\n` +
      `🛏️ *Room Type:* ${roomTitle}\n` +
      `🌙 *Duration:* ${nights} Night(s)\n` +
      `👥 *Devotees:* ${adults} Adult(s)${children > 0 ? `, ${children} Child(ren)` : ""}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Lead Devotee:* ${fullName}\n` +
      `📞 *Mobile:* ${phone}\n` +
      `🕉️ *Darshan E-Pass Assistance:* ${darshanAssistance ? "Yes, please" : "Not needed"}\n` +
      (specialRequests.trim() ? `📝 *Special Notes:* ${specialRequests}\n` : "") +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Total Estimated:* ₹${totalPayable.toLocaleString("en-IN")} (Pay at Property)\n\n` +
      `Please confirm availability and share voucher.`;

    const cleanPhone = APP_CONFIG.SUPPORT_PHONE.replace(/[^0-9]/g, "");
    const waUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    const webWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    try {
      if (await Linking.canOpenURL(waUrl)) {
        await Linking.openURL(waUrl);
      } else {
        await Linking.openURL(webWaUrl);
      }
      onClose();
    } catch {
      Alert.alert(
        "Could Not Open WhatsApp",
        "Your booking request has not been sent. Please try again or contact the support desk directly."
      );
    }
  };

  const handleWhatsAppDesk = async () => {
    const cleanPhone = APP_CONFIG.SUPPORT_PHONE.replace(/[^0-9]/g, "");
    const msg = `Jai Shri Mahakal! I would like to inquire about booking a room at ${hotel.name}.`;
    const waUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    const webWaUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    try {
      if (await Linking.canOpenURL(waUrl)) {
        await Linking.openURL(waUrl);
      } else {
        await Linking.openURL(webWaUrl);
      }
    } catch {
      Alert.alert("Support Desk", `Please call ${APP_CONFIG.SUPPORT_PHONE}`);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* Header with Drag Pill */}
        <View style={styles.sheetHeader}>
          <View style={styles.dragPill} />
          <View style={styles.headerRow}>
            <View style={{ flexShrink: 1 }}>
              <View style={styles.badgeRow}>
                <MaterialIcons name="verified" size={15} color={COLORS.goldDeep} />
                <Text style={styles.badgeText}>DIRECT BOOKING DESK</Text>
              </View>
              <Text style={styles.sheetTitle}>Book Your Stay</Text>
              <Text style={styles.sheetSubtitle}>
                Instant confirmation with direct pilgrim assistance
              </Text>
            </View>

            <TouchableOpacity hitSlop={HIT_SLOP}
              style={styles.closeBtn}
              activeOpacity={0.7}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close booking form"
            >
              <Ionicons name="close" size={20} color={COLORS.inkBody} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(24, insets.bottom + 16) },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Selected Property Quick Card */}
          <View style={styles.propertyCard}>
            <Image
              source={{ uri: activeRoom?.image || hotel.thumbnail || hotel.gallery[0] || "" }}
              style={styles.roomThumb}
              contentFit="cover"
            />
            <View style={styles.propertyInfo}>
              <View>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {hotel.name}
                </Text>
                {hotel.distance_to_mahakal ? (
                  <View style={styles.distanceRow}>
                    <MaterialCommunityIcons name="navigation-variant" size={13} color={COLORS.goldDeep} />
                    <Text style={styles.distanceText}>{hotel.distance_to_mahakal}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.roomTagRow}>
                <Text style={styles.roomTagText} numberOfLines={1}>
                  {activeRoom ? activeRoom.title : (hotel.category ? `${hotel.category.toUpperCase()} Stay` : "Direct Stay")}
                </Text>
                <Text style={styles.roomPriceTag}>
                  ₹{roomPrice.toLocaleString("en-IN")}
                  <Text style={styles.roomPricePerNt}> / nt</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Pilgrimage Dates */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>SACRED PILGRIMAGE DURATION</Text>
            <View style={styles.datesGrid}>
              <View style={styles.dateBox}>
                <View style={styles.dateIconBox}>
                  <MaterialIcons name="calendar-today" size={16} color={COLORS.goldDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dateSmallLabel}>ARRIVAL (CHECK-IN)</Text>
                  <Text style={styles.dateValue}>Day 1 (Flexible)</Text>
                </View>
              </View>

              <View style={styles.dateBox}>
                <View style={styles.dateIconBox}>
                  <MaterialIcons name="event-available" size={16} color={COLORS.goldDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dateSmallLabel}>DEPARTURE ({nights} NIGHTS)</Text>
                  <View style={styles.nightsCounterRow}>
                    <TouchableOpacity hitSlop={HIT_SLOP}
                      style={styles.miniStepBtn}
                      onPress={() => setNights((n) => Math.max(1, n - 1))}
                      accessibilityRole="button"
                      accessibilityLabel="Fewer nights"
                    >
                      <Ionicons name="remove" size={14} color={COLORS.ink} />
                    </TouchableOpacity>
                    <Text style={styles.nightsCount}>{nights}N</Text>
                    <TouchableOpacity hitSlop={HIT_SLOP}
                      style={styles.miniStepBtn}
                      onPress={() => setNights((n) => n + 1)}
                      accessibilityRole="button"
                      accessibilityLabel="More nights"
                    >
                      <Ionicons name="add" size={14} color={COLORS.ink} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Devotees & Yatris Count */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>DEVOTEES & YATRIS COUNT</Text>
            <View style={styles.guestsGrid}>
              {/* Adults */}
              <View style={styles.stepperCard}>
                <View style={styles.stepperLabel}>
                  <Text style={styles.stepperTitle}>Adults</Text>
                  <Text style={styles.stepperSubtitle}>Age 12+</Text>
                </View>
                <View style={styles.counterRow}>
                  <TouchableOpacity hitSlop={HIT_SLOP}
                    style={styles.stepBtn}
                    onPress={() => setAdults((a) => Math.max(1, a - 1))}
                    accessibilityRole="button"
                    accessibilityLabel="Fewer adults"
                  >
                    <Ionicons name="remove" size={14} color={COLORS.ink} />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{adults}</Text>
                  <TouchableOpacity hitSlop={HIT_SLOP}
                    style={[styles.stepBtn, styles.stepBtnAdd]}
                    onPress={() => setAdults((a) => a + 1)}
                    accessibilityRole="button"
                    accessibilityLabel="More adults"
                  >
                    <Ionicons name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Children */}
              <View style={styles.stepperCard}>
                <View style={styles.stepperLabel}>
                  <Text style={styles.stepperTitle}>Children</Text>
                  <Text style={styles.stepperSubtitle}>Age 0–11</Text>
                </View>
                <View style={styles.counterRow}>
                  <TouchableOpacity hitSlop={HIT_SLOP}
                    style={styles.stepBtn}
                    onPress={() => setChildren((c) => Math.max(0, c - 1))}
                    accessibilityRole="button"
                    accessibilityLabel="Fewer children"
                  >
                    <Ionicons name="remove" size={14} color={COLORS.ink} />
                  </TouchableOpacity>
                  <Text style={styles.countText}>{children}</Text>
                  <TouchableOpacity hitSlop={HIT_SLOP}
                    style={[styles.stepBtn, styles.stepBtnAdd]}
                    onPress={() => setChildren((c) => c + 1)}
                    accessibilityRole="button"
                    accessibilityLabel="More children"
                  >
                    <Ionicons name="add" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Lead Devotee Information */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>LEAD DEVOTEE INFORMATION</Text>

            <View style={styles.inputContainer}>
              <MaterialIcons name="badge" size={18} color={COLORS.inkMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputSmallLabel}>FULL NAME (AS PER GOVT ID)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Pandit Rajendra Prasad"
                  placeholderTextColor="#A09895"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { marginTop: 8 }]}>
              <MaterialIcons name="call" size={18} color={COLORS.inkMuted} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputSmallLabel}>MOBILE / WHATSAPP FOR VOUCHER</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#A09895"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { marginTop: 8, alignItems: "flex-start" }]}>
              <MaterialIcons name="notes" size={18} color={COLORS.inkMuted} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.inputSmallLabel}>SPECIAL REQUEST / AARTI TIMINGS</Text>
                <TextInput
                  style={[styles.textInput, { height: 48 }]}
                  placeholder="e.g. Ground floor elder room, early 3 AM Bhasma wake-up"
                  placeholderTextColor="#A09895"
                  multiline
                  numberOfLines={2}
                  value={specialRequests}
                  onChangeText={setSpecialRequests}
                />
              </View>
            </View>
          </View>

          {/* Pilgrimage Add-on: Free Mahakal Darshan / E-Pass Assistance */}
          <TouchableOpacity
            style={styles.addonCard}
            activeOpacity={0.85}
            onPress={() => setDarshanAssistance((d) => !d)}
          >
            <View style={[styles.checkbox, darshanAssistance && styles.checkboxActive]}>
              {darshanAssistance && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.addonTitleRow}>
                <Text style={styles.addonTitle}>Request Mahakal Darshan / E-Pass Assistance</Text>
                <View style={styles.freePill}>
                  <Text style={styles.freeText}>FREE</Text>
                </View>
              </View>
              <Text style={styles.addonDescription}>
                Our on-ground devotee concierge assists with protocol guidelines, VIP queue tokens, and bhasma aarti timings.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Price Breakdown */}
          <View style={styles.priceBreakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Room Charge ({nights} Night{nights > 1 ? "s" : ""} × ₹{roomPrice.toLocaleString("en-IN")})
              </Text>
              <Text style={styles.breakdownValue}>₹{totalPayable.toLocaleString("en-IN")}</Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={{ flexDirection: "row", flexShrink: 1, alignItems: "center", gap: 3 }}>
                <Text style={styles.breakdownLabel}>Temple Pilgrim Cess & Taxes</Text>
                <Ionicons name="information-circle-outline" size={12} color={COLORS.goldDeep} />
              </View>
              <Text style={styles.includedText}>Included</Text>
            </View>

            <View style={styles.breakdownDivider} />

            <View style={styles.totalRow}>
              <View style={{ flexShrink: 1 }}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <View style={styles.payAtCheckinRow}>
                  <MaterialIcons name="payments" size={13} color={COLORS.goldDeep} />
                  <Text style={styles.payAtCheckinText}>Pay at Check-in Available</Text>
                </View>
              </View>
              <Text style={styles.totalAmount}>₹{totalPayable.toLocaleString("en-IN")}</Text>
            </View>
          </View>

          {/* Dual Action CTAs */}
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.confirmBtn}
              activeOpacity={0.85}
              onPress={handleConfirmBooking}
            >
              <Text style={styles.confirmBtnText}>Confirm Booking Request</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whatsappDeskBtn}
              activeOpacity={0.8}
              onPress={handleWhatsAppDesk}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
              <Text style={styles.whatsappDeskText}>Enquire via WhatsApp Devotee Desk</Text>
            </TouchableOpacity>
          </View>

          {/* Reassurance */}
          <View style={styles.trustReassurance}>
            <MaterialIcons name="verified-user" size={15} color={COLORS.goldDeep} />
            <Text style={styles.trustReassuranceText}>
              Official UjjainTirth Verified Stay · 100% Satvik Atmosphere Guarantee
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(107, 29, 47, 0.08)",
    backgroundColor: COLORS.bg,
  },
  dragPill: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E2DD",
    alignSelf: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.goldDeep,
    letterSpacing: 1.2,
    flexShrink: 1,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.bold,
    color: COLORS.sacredDeep,
  },
  sheetSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  propertyCard: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
  },
  roomThumb: {
    width: 76,
    height: 76,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgStone,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  hotelName: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacredDeep,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.goldDeep,
    flexShrink: 1,
  },
  roomTagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  roomTagText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
    flex: 1,
  },
  roomPriceTag: {
    fontSize: 13,
    fontFamily: FONTS.display.bold,
    color: COLORS.sacredDeep,
    flexShrink: 1,
  },
  roomPricePerNt: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  formSection: {
    gap: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dateBox: {
    // Two per row when they fit; stacks on narrow phones / large text.
    flexGrow: 1,
    flexBasis: 150,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  dateIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 220, 195, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateSmallLabel: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
  },
  dateValue: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.ink,
    marginTop: 2,
  },
  nightsCounterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  miniStepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
  },
  nightsCount: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacredDeep,
    flexShrink: 1,
  },
  guestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stepperCard: {
    flexGrow: 1,
    flexBasis: 150,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
  },
  stepperLabel: {
    flexShrink: 1,
  },
  stepperTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  stepperSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
  },
  stepBtnAdd: {
    backgroundColor: COLORS.sacred,
  },
  countText: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacredDeep,
    minWidth: 14,
    textAlign: "center",
    flexShrink: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.06)",
  },
  inputSmallLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    letterSpacing: 0.8,
  },
  textInput: {
    fontSize: 13,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.ink,
    paddingVertical: 2,
  },
  addonCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: RADIUS.lg,
    backgroundColor: "rgba(255, 220, 195, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(254, 147, 44, 0.3)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: COLORS.sacredDeep,
  },
  addonTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addonTitle: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacredDeep,
    flex: 1,
  },
  freePill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: COLORS.saffron,
    flexShrink: 1,
  },
  freeText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#2F1500",
  },
  addonDescription: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    marginTop: 2,
    lineHeight: 15,
  },
  priceBreakdownCard: {
    padding: 14,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceMuted,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    flexShrink: 1,
  },
  breakdownValue: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    flexShrink: 1,
  },
  includedText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.goldDeep,
    flexShrink: 1,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: "rgba(107, 29, 47, 0.08)",
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: FONTS.display.bold,
    color: COLORS.sacredDeep,
  },
  payAtCheckinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  payAtCheckinText: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.goldDeep,
    flexShrink: 1,
  },
  totalAmount: {
    fontSize: 22,
    fontFamily: FONTS.display.bold,
    color: COLORS.sacredDeep,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  actionButtonsCol: {
    gap: 8,
    marginTop: 4,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.sacred,
    ...SHADOWS.md,
  },
  confirmBtnText: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.white,
    flexShrink: 1,
  },
  whatsappDeskBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.12)",
  },
  whatsappDeskText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacredDeep,
    flexShrink: 1,
  },
  trustReassurance: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 4,
  },
  trustReassuranceText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    textAlign: "center",
    flexShrink: 1,
  },
});
