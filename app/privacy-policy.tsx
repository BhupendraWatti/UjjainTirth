import ScreenContainer from "@/components/layout/ScreenContainer";
import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PolicyItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  summary: string;
  bullets: string[];
}

const ESSENTIAL_POLICY_POINTS: PolicyItem[] = [
  {
    id: "collection",
    icon: "person-circle-outline",
    title: "1. Information We Collect",
    summary: "Only what is essential for Vedic rituals and pilgrimage bookings.",
    bullets: [
      "Contact Info: Name, phone number, and email to deliver booking receipts and WhatsApp updates.",
      "Vedic Ritual Details (Sankalp): Gotra and devotee names provided voluntarily for priest chanting.",
      "Accommodation ID: Government photo ID metadata strictly required by Dharamshala check-in laws.",
    ],
  },
  {
    id: "sankalp-usage",
    icon: "flame-outline",
    title: "2. Ritual Sanctity & Data Protection",
    summary: "Sankalp information is never commercialized or shared publicly.",
    bullets: [
      "Vedic details are shared exclusively with authorized temple purohits performing your specific ritual.",
      "Priests are bound by confidentiality to use ritual details only during the designated muhurat.",
      "All devotee records reside on encrypted cloud servers located securely in India.",
    ],
  },
  {
    id: "payments",
    icon: "card-outline",
    title: "3. 100% Secure Payments",
    summary: "Processed via RBI-authorized payment gateways with 256-bit encryption.",
    bullets: [
      "Transactions are handled by PCI-DSS compliant gateways (Razorpay, UPI, Netbanking).",
      "Ujjain Tirth never stores or captures your UPI MPIN, ATM PINs, card CVV, or passwords.",
      "We receive only an authorized transaction reference token for receipt generation.",
    ],
  },
  {
    id: "permissions",
    icon: "location-outline",
    title: "4. Device & Location Permissions",
    summary: "Transparent app access with zero background tracking.",
    bullets: [
      "Foreground Location: Used solely to show your distance from Mahakal and sacred temples in Ujjain.",
      "Zero Background Tracking: We do not track your location when the app is closed.",
      "Storage Access: Optional, used only if you download booking receipts or temple guides.",
    ],
  },
  {
    id: "rights",
    icon: "trash-outline",
    title: "5. Your Rights & Account Deletion",
    summary: "You have complete ownership and control over your personal data.",
    bullets: [
      "Right to Access: You can inspect and export your profile and booking history anytime.",
      "Right to Erasure (Account Deletion): Request permanent account and data deletion with one tap via Devotee Support or by emailing info@ujjaintirth.com.",
      "All active records are purged within 7 business days upon request.",
    ],
  },
];

export default function PrivacyPolicyScreen() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    collection: true,
    "sankalp-usage": true,
  });

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(style);
    }
  };

  const handleBack = () => {
    triggerHaptic();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/more");
    }
  };

  const toggleSection = (id: string) => {
    triggerHaptic();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEmailGrievance = async () => {
    triggerHaptic();
    const mailUrl = `mailto:grievance@ujjaintirth.com?subject=${encodeURIComponent(
      "Privacy Query / Data Request - Ujjain Tirth"
    )}`;
    try {
      await Linking.openURL(mailUrl);
    } catch {
      // Fallback
    }
  };

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
          <Text style={styles.headerSubBadge}>DATA SANCTITY</Text>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>

        <TouchableOpacity
          style={styles.helpHeaderBtn}
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            router.push("/help-support" as any);
          }}
          accessibilityLabel="Help and Support"
        >
          <Ionicons name="help-buoy-outline" size={17} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO BANNER ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.pillBadge}>
              <Ionicons name="shield-checkmark" size={15} color={COLORS.sacred} />
              <Text style={styles.pillBadgeText}>DPDP Act 2023 Compliant</Text>
            </View>
            <Text style={styles.versionText}>Updated Oct 2026</Text>
          </View>

          <Text style={styles.heroHeadline}>Your Devotion & Privacy Are Sacred</Text>
          <Text style={styles.heroDescription}>
            We safeguard your spiritual sankalps, booking records, and payments with
            uncompromising reverence. Here is our policy in clear, simple terms.
          </Text>

          {/* 4 Trust Highlights Grid */}
          <View style={styles.bentoGrid}>
            <View style={styles.bentoBox}>
              <Ionicons name="ban-outline" size={18} color={COLORS.primary} />
              <Text style={styles.bentoTitle}>Zero Ads / Sale</Text>
              <Text style={styles.bentoSub}>Data is never sold to advertisers</Text>
            </View>

            <View style={styles.bentoBox}>
              <Ionicons name="flame-outline" size={18} color={COLORS.sacred} />
              <Text style={styles.bentoTitle}>Sankalp Sanctity</Text>
              <Text style={styles.bentoSub}>Gotra shared only with purohits</Text>
            </View>

            <View style={styles.bentoBox}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.journey} />
              <Text style={styles.bentoTitle}>256-Bit Security</Text>
              <Text style={styles.bentoSub}>RBI-compliant safe checkout</Text>
            </View>

            <View style={styles.bentoBox}>
              <Ionicons name="trash-bin-outline" size={18} color={COLORS.gold} />
              <Text style={styles.bentoTitle}>Delete Anytime</Text>
              <Text style={styles.bentoSub}>1-tap account erasure on request</Text>
            </View>
          </View>
        </View>

        {/* ── ESSENTIAL POLICY ACCORDION ── */}
        <View style={styles.policySections}>
          <Text style={styles.sectionHeaderTitle}>Essential Privacy Terms</Text>

          {ESSENTIAL_POLICY_POINTS.map((sec) => {
            const isExpanded = !!expandedSections[sec.id];
            return (
              <View key={sec.id} style={styles.policyCard}>
                <TouchableOpacity
                  style={styles.policyHeader}
                  activeOpacity={0.75}
                  onPress={() => toggleSection(sec.id)}
                >
                  <View style={styles.policyIconCircle}>
                    <Ionicons name={sec.icon} size={18} color={COLORS.primary} />
                  </View>

                  <View style={styles.policyTitleWrap}>
                    <Text style={styles.policyTitle}>{sec.title}</Text>
                    <Text style={styles.policySummary}>{sec.summary}</Text>
                  </View>

                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={COLORS.inkMuted}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.policyBody}>
                    {sec.bullets.map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletRow}>
                        <View style={styles.bulletDot} />
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── GRIEVANCE REDRESSAL CARD ── */}
        <View style={styles.grievanceCard}>
          <View style={styles.grievanceHeaderRow}>
            <View style={styles.grievancePill}>
              <Ionicons name="shield-half-outline" size={15} color={COLORS.sacred} />
              <Text style={styles.grievancePillText}>Statutory Redressal</Text>
            </View>
            <Text style={styles.responseSpeed}>Response: &lt; 48 hrs</Text>
          </View>

          <Text style={styles.grievanceTitle}>Contact Support</Text>
          <Text style={styles.grievanceDesc}>
            For any data requests or inquiries, reach out to us:
          </Text>

          <View style={styles.officerBox}>
            <Text style={styles.officerName}>
              Devotee Care Team{" "}
              <Text style={styles.officerRole}>(Data Privacy Desk)</Text>
            </Text>
            <Text style={styles.officerEmail}>Email: info@ujjaintirth.com</Text>
            <Text style={styles.officerAddress}>
              Indore Road, Ujjain, Madhya Pradesh, India, 4560610
            </Text>
          </View>

          <TouchableOpacity
            style={styles.grievanceBtn}
            activeOpacity={0.8}
            onPress={handleEmailGrievance}
          >
            <Ionicons name="mail" size={15} color="#FFF" />
            <Text style={styles.grievanceBtnText}>Email Grievance Officer</Text>
          </TouchableOpacity>
        </View>

        {/* ── FOOTER ASSISTANCE ── */}
        <View style={styles.footerHelpCard}>
          <View style={styles.footerHelpTextWrap}>
            <Text style={styles.footerHelpTitle}>Have questions or need help?</Text>
            <Text style={styles.footerHelpSub}>
              Our pilgrim care team is available 24/7 to assist you.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contactSupportBtn}
            activeOpacity={0.8}
            onPress={() => {
              triggerHaptic();
              router.push("/help-support" as any);
            }}
          >
            <Text style={styles.contactSupportBtnText}>Help & Contact</Text>
            <Ionicons name="arrow-forward" size={13} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ── LEGAL FOOTER ── */}
        <View style={styles.legalFooter}>
          <Text style={styles.copyrightText}>
            © 2026 {APP_CONFIG.APP_NAME} Pilgrimage Services Pvt. Ltd.
          </Text>
          <Text style={styles.legalSub}>Ujjain, Madhya Pradesh • All rights reserved</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    color: COLORS.sacred,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginTop: 1,
  },
  helpHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Hero Card */
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 5,
  },
  pillBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  versionText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  heroHeadline: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
    marginBottom: 14,
  },

  /* Bento Trust Grid */
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bentoBox: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  bentoTitle: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginTop: 5,
    marginBottom: 1,
  },
  bentoSub: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 13,
  },

  /* Policy Sections */
  policySections: {
    marginBottom: 14,
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
    marginLeft: 2,
  },
  policyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    overflow: "hidden",
    ...SHADOWS.subtle,
  },
  policyHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    gap: 10,
  },
  policyIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  policyTitleWrap: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  policySummary: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 15,
    marginTop: 1,
  },
  policyBody: {
    paddingHorizontal: 14,
    paddingBottom: 13,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    backgroundColor: "#FDFCF9",
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.gold,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 17,
  },

  /* Grievance Card */
  grievanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.15)",
    marginBottom: 12,
    ...SHADOWS.card,
  },
  grievanceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  grievancePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  grievancePillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  responseSpeed: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: COLORS.success,
  },
  grievanceTitle: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 3,
  },
  grievanceDesc: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  officerBox: {
    backgroundColor: COLORS.surfaceMuted,
    padding: 10,
    borderRadius: RADIUS.xs,
    gap: 4,
    marginBottom: 10,
  },
  officerName: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  officerRole: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  officerEmail: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: COLORS.primary,
  },
  officerAddress: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  grievanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.sacred,
    paddingVertical: 9,
    borderRadius: RADIUS.xs,
    gap: 6,
  },
  grievanceBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },

  /* Footer Help Card */
  footerHelpCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryTint,
    borderRadius: RADIUS.sm,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  footerHelpTextWrap: {
    flex: 1,
  },
  footerHelpTitle: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  footerHelpSub: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    marginTop: 1,
  },
  contactSupportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  contactSupportBtnText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
  },

  /* Legal Note */
  legalFooter: {
    alignItems: "center",
    paddingVertical: 4,
    gap: 2,
  },
  copyrightText: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
  },
  legalSub: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkFaint,
  },
});
