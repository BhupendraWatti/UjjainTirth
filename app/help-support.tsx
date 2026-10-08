import ScreenContainer from "@/components/layout/ScreenContainer";
import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const ESSENTIAL_FAQS: FaqItem[] = [
  {
    id: "pooja-proof",
    category: "Poojas",
    question: "How do I get video proof of my booked Pooja?",
    answer:
      "All Vedic Poojas are performed by verified purohits with your Name & Gotra in the Sankalp. High-definition photos and Sankalp video clips are uploaded to 'My Bookings' within 24 hours.",
  },
  {
    id: "dress-code",
    category: "Darshan",
    question: "What is the dress code for Bhasma Aarti & Garbhagriha?",
    answer:
      "Traditional attire is mandatory. Men must wear an unstitched Dhoti and Solah. Women must wear a traditional Saree. Kurta-pajama, jeans, and western clothes are not allowed inside the sanctum.",
  },
  {
    id: "cancellation-refund",
    category: "Refunds",
    question: "What is the cancellation and refund policy?",
    answer:
      "Cancellations requested 24+ hours before the scheduled muhurat or stay check-in receive a 100% refund. Within 24 hours, cancellations cannot be refunded as pandits and rooms are pre-reserved.",
  },
  {
    id: "dharamshala-checkin",
    category: "Stay",
    question: "How do I check in to my Dharamshala / Hotel?",
    answer:
      "Show your digital booking voucher in the app along with a valid Government Photo ID (Aadhaar/Voter ID) at the reception. Standard check-in is 12:00 PM and check-out is 11:00 AM.",
  },
  {
    id: "prasad-delivery",
    category: "Prasad",
    question: "How is holy Mahakal Prasad dispatched across India?",
    answer:
      "Energized dry prasad (Bhasma, dry fruits, divine coin, Raksha Sutra) is packed hygienically and couriered via Speed Post with tracking details sent to your registered mobile number.",
  },
];

const FAQ_CATEGORIES = ["All", "Poojas", "Darshan", "Refunds", "Stay", "Prasad"];

const EMERGENCY_CONTACTS = [
  {
    name: "Mahakal Temple Control Room",
    phone: "0734-2550059",
    dialNumber: "07342550059",
    icon: "business-outline" as const,
  },
  {
    name: "Pilgrim Police Helpline",
    phone: "112 / 0734-2525252",
    dialNumber: "112",
    icon: "shield-outline" as const,
  },
  {
    name: "Ambulance & Medical SOS",
    phone: "108",
    dialNumber: "108",
    icon: "medical-outline" as const,
  },
];

export default function HelpSupportScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const initialTab = params.tab === "contact" ? "contact" : "help";
  const [activeTab, setActiveTab] = useState<"help" | "contact">(initialTab);

  useEffect(() => {
    if (params.tab === "contact" || params.tab === "help") {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

  // Help & FAQs state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({
    "pooja-proof": true,
  });

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactPhoneOrBooking, setContactPhoneOrBooking] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(style);
    }
  };

  const switchTab = (tab: "help" | "contact") => {
    triggerHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const handleBack = () => {
    triggerHaptic();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/more");
    }
  };

  const toggleFaq = (id: string) => {
    triggerHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCall = async (phoneNumber: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const telUrl = Platform.select({
      ios: `telprompt:${phoneNumber}`,
      android: `tel:${phoneNumber}`,
      default: `tel:${phoneNumber}`,
    });

    try {
      const supported = await Linking.canOpenURL(telUrl);
      if (supported) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert("Cannot Make Call", `Please dial ${phoneNumber} directly from your phone.`);
      }
    } catch {
      Alert.alert("Notice", `Please dial ${phoneNumber} directly.`);
    }
  };

  const handleWhatsApp = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const cleanNumber = APP_CONFIG.SUPPORT_PHONE.replace(/[^0-9]/g, "");
    const message = "Jai Shree Mahakal! 🙏 I need assistance regarding Ujjain Tirth pilgrimage services.";
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Notice", `Please WhatsApp us at ${APP_CONFIG.SUPPORT_PHONE}`);
    }
  };

  const handleEmail = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    const subject = "Pilgrimage Assistance - Ujjain Tirth";
    const body = "Jai Shree Mahakal,\n\nI need help with:\n\nContact Number:\nBooking ID (if any):";
    const url = `mailto:${APP_CONFIG.SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Notice", `Please email us at ${APP_CONFIG.SUPPORT_EMAIL}`);
    }
  };

  const handleOpenMaps = async () => {
    triggerHaptic();
    const query = encodeURIComponent("Shree Mahakaleshwar Temple, Ujjain, Madhya Pradesh 456006");
    const mapsUrl = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });

    try {
      await Linking.openURL(mapsUrl);
    } catch {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    }
  };

  const handleSubmitContactForm = () => {
    if (!contactMessage.trim()) {
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      Alert.alert("Message Required", "Please enter your query or message so we can assist you.");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const token = `UT-${Math.floor(100000 + Math.random() * 900000)}`;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSubmittedTicketId(token);
  };

  const handleResetContactForm = () => {
    triggerHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSubmittedTicketId(null);
    setContactName("");
    setContactPhoneOrBooking("");
    setContactMessage("");
  };

  const filteredFaqs = useMemo(() => {
    return ESSENTIAL_FAQS.filter((faq) => {
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <ScreenContainer noPadding>
      {/* ── TOP HEADER ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerSubBadge}>PILGRIM SUPPORT</Text>
          <Text style={styles.headerTitle}>Help & Contact</Text>
        </View>

        <TouchableOpacity
          style={styles.headerCallBtn}
          activeOpacity={0.7}
          onPress={() => handleCall(APP_CONFIG.SUPPORT_PHONE)}
          accessibilityLabel="Call Support"
        >
          <Ionicons name="call" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ── SEGMENTED TAB SWITCHER ── */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabSegmentWrapper}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "help" && styles.tabButtonActive]}
            activeOpacity={0.8}
            onPress={() => switchTab("help")}
          >
            <Ionicons
              name="help-circle"
              size={16}
              color={activeTab === "help" ? "#FFF" : COLORS.inkMuted}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "help" && styles.tabButtonTextActive,
              ]}
            >
              Help & FAQs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "contact" && styles.tabButtonActive]}
            activeOpacity={0.8}
            onPress={() => switchTab("contact")}
          >
            <Ionicons
              name="call"
              size={15}
              color={activeTab === "contact" ? "#FFF" : COLORS.inkMuted}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "contact" && styles.tabButtonTextActive,
              ]}
            >
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {activeTab === "help" ? (
          /* ══════════════════════════════════════════════
             TAB 1: HELP & FAQS (ESSENTIALS ONLY)
             ══════════════════════════════════════════════ */
          <View>
            {/* Quick Search */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={17} color={COLORS.inkMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search ritual proof, dress code, refunds..."
                placeholderTextColor={COLORS.inkFaint}
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic();
                    setSearchQuery("");
                  }}
                >
                  <Ionicons name="close-circle" size={17} color={COLORS.inkMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {FAQ_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catPill, active && styles.catPillActive]}
                    activeOpacity={0.7}
                    onPress={() => {
                      triggerHaptic();
                      setSelectedCategory(cat);
                    }}
                  >
                    <Text style={[styles.catPillText, active && styles.catPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Essential FAQs List */}
            <View style={styles.faqList}>
              {filteredFaqs.length === 0 ? (
                <View style={styles.emptyFaqCard}>
                  <Ionicons name="help-buoy-outline" size={32} color={COLORS.inkFaint} />
                  <Text style={styles.emptyFaqTitle}>No matching answers</Text>
                  <Text style={styles.emptyFaqSub}>
                    Have a specific question? Switch to Contact Us to talk with our team.
                  </Text>
                  <TouchableOpacity
                    style={styles.switchContactBtn}
                    activeOpacity={0.8}
                    onPress={() => switchTab("contact")}
                  >
                    <Text style={styles.switchContactText}>Go to Contact Us</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredFaqs.map((faq) => {
                  const isExpanded = !!expandedFaqs[faq.id];
                  return (
                    <View key={faq.id} style={styles.faqCard}>
                      <TouchableOpacity
                        style={styles.faqHeader}
                        activeOpacity={0.75}
                        onPress={() => toggleFaq(faq.id)}
                      >
                        <View style={styles.faqQuestionWrap}>
                          <View style={styles.faqCategoryBadge}>
                            <Text style={styles.faqCategoryText}>{faq.category}</Text>
                          </View>
                          <Text style={styles.faqQuestionText}>{faq.question}</Text>
                        </View>
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color={COLORS.inkMuted}
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.faqAnswerBody}>
                          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </View>

            {/* Still Need Assistance Banner */}
            <View style={styles.helpCtaBanner}>
              <View style={styles.helpCtaIconBox}>
                <Ionicons name="chatbubbles" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.helpCtaTextWrap}>
                <Text style={styles.helpCtaTitle}>Didn't find your answer?</Text>
                <Text style={styles.helpCtaSub}>
                  Our Ujjain pilgrim care team is ready to assist you personally.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.helpCtaBtn}
                activeOpacity={0.8}
                onPress={() => switchTab("contact")}
              >
                <Text style={styles.helpCtaBtnText}>Contact Us</Text>
                <Ionicons name="arrow-forward" size={13} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ══════════════════════════════════════════════
             TAB 2: CONTACT US (ESSENTIALS ONLY)
             ══════════════════════════════════════════════ */
          <View>
            {/* Status Banner */}
            <View style={styles.careStatusBanner}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Devotee Desk 24/7 Active</Text>
              </View>
              <Text style={styles.responseTimeText}>Avg reply &lt; 5 mins</Text>
            </View>

            {/* 3 Direct Contact Options */}
            <View style={styles.contactOptionsGrid}>
              {/* Call */}
              <TouchableOpacity
                style={[styles.contactCard, styles.callCard]}
                activeOpacity={0.8}
                onPress={() => handleCall(APP_CONFIG.SUPPORT_PHONE)}
              >
                <View style={[styles.contactIconCircle, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="call" size={18} color="#FFF" />
                </View>
                <Text style={styles.contactCardTitle}>Call Helpline</Text>
                <Text style={styles.contactCardSub}>24/7 Toll-Free</Text>
                <View style={styles.contactPillBtn}>
                  <Text style={styles.contactPillText}>Call Now</Text>
                </View>
              </TouchableOpacity>

              {/* WhatsApp */}
              <TouchableOpacity
                style={[styles.contactCard, styles.waCard]}
                activeOpacity={0.8}
                onPress={handleWhatsApp}
              >
                <View style={[styles.contactIconCircle, { backgroundColor: COLORS.whatsapp }]}>
                  <Ionicons name="logo-whatsapp" size={19} color="#FFF" />
                </View>
                <Text style={styles.contactCardTitle}>WhatsApp</Text>
                <Text style={styles.contactCardSub}>Hindi / English</Text>
                <View style={[styles.contactPillBtn, { backgroundColor: COLORS.whatsapp }]}>
                  <Text style={styles.contactPillText}>Chat Now</Text>
                </View>
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity
                style={[styles.contactCard, styles.emailCard]}
                activeOpacity={0.8}
                onPress={handleEmail}
              >
                <View style={[styles.contactIconCircle, { backgroundColor: COLORS.journey }]}>
                  <Ionicons name="mail" size={17} color="#FFF" />
                </View>
                <Text style={styles.contactCardTitle}>Email Desk</Text>
                <Text style={styles.contactCardSub}>Booking receipts</Text>
                <View style={[styles.contactPillBtn, { backgroundColor: COLORS.journey }]}>
                  <Text style={styles.contactPillText}>Send Mail</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Quick Callback / Message Form */}
            <View style={styles.quickFormCard}>
              <View style={styles.quickFormHeader}>
                <Ionicons name="chatbox-ellipses-outline" size={18} color={COLORS.primary} />
                <Text style={styles.quickFormTitle}>Send a Quick Message</Text>
              </View>

              {submittedTicketId ? (
                <View style={styles.formSuccessBox}>
                  <Ionicons name="checkmark-circle" size={40} color={COLORS.success} />
                  <Text style={styles.formSuccessTitle}>Request Received!</Text>
                  <Text style={styles.formSuccessSub}>
                    Token: <Text style={styles.boldText}>{submittedTicketId}</Text>
                  </Text>
                  <Text style={styles.formSuccessDetail}>
                    Our pilgrim coordinator will contact you shortly.
                  </Text>
                  <TouchableOpacity
                    style={styles.newQueryBtn}
                    activeOpacity={0.8}
                    onPress={handleResetContactForm}
                  >
                    <Text style={styles.newQueryText}>Send Another Message</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formInputsWrap}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Your Name (Optional)"
                    placeholderTextColor={COLORS.inkFaint}
                    value={contactName}
                    onChangeText={setContactName}
                  />

                  <TextInput
                    style={styles.inputField}
                    placeholder="Phone Number or Booking ID (Optional)"
                    placeholderTextColor={COLORS.inkFaint}
                    value={contactPhoneOrBooking}
                    onChangeText={setContactPhoneOrBooking}
                  />

                  <TextInput
                    style={[styles.inputField, styles.textAreaField]}
                    placeholder="Describe your inquiry or request... *"
                    placeholderTextColor={COLORS.inkFaint}
                    value={contactMessage}
                    onChangeText={setContactMessage}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    style={styles.submitMessageBtn}
                    activeOpacity={0.85}
                    onPress={handleSubmitContactForm}
                  >
                    <Ionicons name="paper-plane" size={15} color="#FFF" />
                    <Text style={styles.submitMessageText}>Submit Request</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Official Ujjain Helplines */}
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyTitleRow}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.sacred} />
                <Text style={styles.emergencySectionTitle}>Official Ujjain Mandir Helplines</Text>
              </View>

              <View style={styles.emergencyList}>
                {EMERGENCY_CONTACTS.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.emergencyItem}
                    activeOpacity={0.7}
                    onPress={() => handleCall(item.dialNumber)}
                  >
                    <View style={styles.emergencyItemIcon}>
                      <Ionicons name={item.icon} size={16} color={COLORS.sacred} />
                    </View>
                    <View style={styles.emergencyItemText}>
                      <Text style={styles.emergencyItemName}>{item.name}</Text>
                      <Text style={styles.emergencyItemPhone}>{item.phone}</Text>
                    </View>
                    <View style={styles.emergencyCallChip}>
                      <Ionicons name="call" size={12} color={COLORS.sacred} />
                      <Text style={styles.emergencyCallChipText}>Call</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Physical Helpdesk in Ujjain */}
            <View style={styles.officeCard}>
              <View style={styles.officeHeader}>
                <Ionicons name="location" size={18} color={COLORS.gold} />
                <View style={styles.officeHeaderTexts}>
                  <Text style={styles.officeTitle}>On-Ground Devotee Helpdesk</Text>
                  <Text style={styles.officeSub}>Gate No. 4, Mahakaleshwar Temple, Ujjain</Text>
                </View>
              </View>

              <View style={styles.officeMetaRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.inkMuted} />
                <Text style={styles.officeMetaText}>Open Daily: 05:00 AM – 11:00 PM</Text>
              </View>

              <TouchableOpacity
                style={styles.mapsButton}
                activeOpacity={0.8}
                onPress={handleOpenMaps}
              >
                <Ionicons name="navigate-outline" size={15} color={COLORS.journey} />
                <Text style={styles.mapsButtonText}>Get Directions on Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── FOOTER: PRIVACY POLICY LINK ── */}
        <TouchableOpacity
          style={styles.privacyLinkCard}
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            router.push("/privacy-policy" as any);
          }}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.inkMuted} />
          <Text style={styles.privacyLinkText}>Review Privacy Policy & Devotee Data Sanctity</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.inkMuted} />
        </TouchableOpacity>

        {/* ── SACRED FOOTER BLESSING ── */}
        <View style={styles.sacredFooter}>
          <Text style={styles.shloka}>॥ ॐ नमः शिवाय ॥</Text>
          <Text style={styles.brandNote}>Ujjain Tirth • Empowering Sacred Journeys</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  /* Header */
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerSubBadge: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginTop: 1,
  },
  headerCallBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.subtle,
  },

  /* Segmented Tab Switcher */
  tabBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },
  tabSegmentWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.bgStone,
    borderRadius: RADIUS.full,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.subtle,
  },
  tabButtonText: {
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  tabButtonTextActive: {
    color: "#FFF",
    fontFamily: FONTS.body.bold,
  },

  /* Scroll Content */
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },

  /* Search */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.ink,
    padding: 0,
  },

  /* Category Filter */
  categoryRow: {
    flexDirection: "row",
    gap: 6,
    paddingBottom: 10,
  },
  catPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catPillText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkBody,
  },
  catPillTextActive: {
    color: "#FFF",
    fontFamily: FONTS.body.bold,
  },

  /* FAQs */
  faqList: {
    gap: 8,
    marginBottom: 14,
  },
  faqCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    overflow: "hidden",
    ...SHADOWS.subtle,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    gap: 10,
  },
  faqQuestionWrap: {
    flex: 1,
  },
  faqCategoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginBottom: 3,
  },
  faqCategoryText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
  },
  faqQuestionText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    lineHeight: 18,
  },
  faqAnswerBody: {
    paddingHorizontal: 13,
    paddingBottom: 13,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    backgroundColor: "#FDFCF9",
  },
  faqAnswerText: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
    marginTop: 4,
  },
  emptyFaqCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  emptyFaqTitle: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginTop: 8,
    marginBottom: 4,
  },
  emptyFaqSub: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    marginBottom: 12,
  },
  switchContactBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  switchContactText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },

  /* Help CTA Banner */
  helpCtaBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
    gap: 10,
    marginBottom: 12,
  },
  helpCtaIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  helpCtaTextWrap: {
    flex: 1,
  },
  helpCtaTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  helpCtaSub: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 1,
  },
  helpCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  helpCtaBtnText: {
    color: "#FFF",
    fontSize: 11,
    fontFamily: FONTS.body.bold,
  },

  /* ── Contact Us Styles ── */
  careStatusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  responseTimeText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.success,
  },

  contactOptionsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  callCard: {
    borderColor: "rgba(235, 92, 73, 0.25)",
  },
  waCard: {
    borderColor: "rgba(37, 211, 102, 0.25)",
  },
  emailCard: {
    borderColor: "rgba(11, 110, 127, 0.25)",
  },
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  contactCardTitle: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginBottom: 1,
  },
  contactCardSub: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginBottom: 8,
  },
  contactPillBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  contactPillText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: FONTS.body.bold,
  },

  /* Quick Form Card */
  quickFormCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: 12,
    ...SHADOWS.subtle,
  },
  quickFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  quickFormTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  formInputsWrap: {
    gap: 8,
  },
  inputField: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.xs,
    paddingHorizontal: 11,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  textAreaField: {
    minHeight: 70,
  },
  submitMessageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.xs,
    gap: 6,
    marginTop: 2,
  },
  submitMessageText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },
  formSuccessBox: {
    alignItems: "center",
    paddingVertical: 12,
  },
  formSuccessTitle: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginTop: 6,
    marginBottom: 2,
  },
  formSuccessSub: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
  },
  formSuccessDetail: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 4,
    marginBottom: 10,
  },
  newQueryBtn: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  newQueryText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },

  /* Emergency Helplines */
  emergencyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 13,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.15)",
    marginBottom: 12,
  },
  emergencyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  emergencySectionTitle: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emergencyList: {
    gap: 6,
  },
  emergencyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDF8F8",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.08)",
    gap: 8,
  },
  emergencyItemIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.sacredTint,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyItemText: {
    flex: 1,
  },
  emergencyItemName: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  emergencyItemPhone: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: COLORS.sacred,
  },
  emergencyCallChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 3,
  },
  emergencyCallChipText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },

  /* Physical Office */
  officeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: 12,
  },
  officeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  officeHeaderTexts: {
    flex: 1,
  },
  officeTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  officeSub: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  officeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
    marginLeft: 26,
  },
  officeMetaText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  mapsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.journeyTint,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 5,
  },
  mapsButtonText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },

  /* Privacy Link */
  privacyLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: 8,
    marginBottom: 16,
  },
  privacyLinkText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },

  /* Sacred Footer */
  sacredFooter: {
    alignItems: "center",
    paddingVertical: 6,
    gap: 2,
  },
  shloka: {
    fontSize: 13,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: 0.8,
  },
  brandNote: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkFaint,
  },
  boldText: {
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
});
