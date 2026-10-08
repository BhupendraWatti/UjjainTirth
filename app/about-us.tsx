import ScreenContainer from "@/components/layout/ScreenContainer";
import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ServiceOffering {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  category: string;
  description: string;
  tagColor: string;
}

const WHAT_WE_OFFER: ServiceOffering[] = [
  {
    id: "pooja",
    icon: "flame-outline",
    title: "Vedic Poojas & Anushthan",
    category: "Sacred Rituals",
    description:
      "Authentic Kaal Sarp Dosh, Mahamrityunjaya Jaap, Rudrabhishek, and Mangaldosh rituals performed by verified purohits with personalized Gotra Sankalp and HD video proof.",
    tagColor: COLORS.sacred,
  },
  {
    id: "darshan",
    icon: "eye-outline",
    title: "Guided Darshan & Temple Tours",
    category: "Spiritual Darshan",
    description:
      "Seamless guidance for Shree Mahakaleshwar Bhasma Aarti, Garbhagriha darshan, and visits to Kal Bhairav, Harsiddhi Shaktipeeth, Mangalnath, and Sandipani Ashram.",
    tagColor: COLORS.primary,
  },
  {
    id: "packages",
    icon: "map-outline",
    title: "Pilgrimage Tour Packages",
    category: "Custom Itineraries",
    description:
      "All-inclusive spiritual packages covering Ujjain Local Darshan, Omkareshwar Jyotirlinga Day Tours, 84 Mahadevas Circuit, and Panchkroshi Yatra.",
    tagColor: COLORS.journey,
  },
  {
    id: "narmada",
    icon: "water-outline",
    title: "Sacred Narmada Parikrama",
    category: "Holy Parikrama",
    description:
      "Comprehensive guided itineraries along holy Ma Narmada with verified ashram stays, sattvic meals, and spiritual facilitators for transformative devotion.",
    tagColor: COLORS.journey,
  },
  {
    id: "stay",
    icon: "bed-outline",
    title: "Clean Dharamshalas & Hotels",
    category: "Accommodations",
    description:
      "Pre-verified dharamshalas, ashrams, and AC hotels close to Mahakaleshwar temple, tailored to family comfort, cleanliness, and honest pricing.",
    tagColor: COLORS.gold,
  },
  {
    id: "transport",
    icon: "car-outline",
    title: "Pilgrim Cabs & Transfers",
    category: "Safe Mobility",
    description:
      "24/7 dedicated AC cabs for Ujjain railway station pickups, Indore airport transfers, and local temple sightseeing with experienced, respectful local drivers.",
    tagColor: COLORS.journey,
  },
  {
    id: "prasad",
    icon: "gift-outline",
    title: "Holy Mahakal Prasad Delivery",
    category: "Devotional Dispatch",
    description:
      "Hygienically packed sacred dry prasad (energized Bhasma, dry fruits, holy silver coin, Raksha Sutra) delivered safely to devotees across India via Speed Post.",
    tagColor: COLORS.sacred,
  },
];

const MILESTONES = [
  { count: "14+", label: "Years Experience", sub: "Since 2011" },
  { count: "8K+", label: "Happy Devotees", sub: "Across India" },
  { count: "98%", label: "Satisfaction", sub: "Devotee Trust" },
  { count: "24/7", label: "Devotee Desk", sub: "On-Ground Ujjain" },
];

export default function AboutUsScreen() {
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

  const handleCall = async (phone: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const telUrl = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(telUrl);
      if (supported) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert("Notice", `Please call ${phone} directly.`);
      }
    } catch {
      Alert.alert("Notice", `Please call ${phone} directly.`);
    }
  };

  const handleOpenWebsite = async (url: string) => {
    triggerHaptic();
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to Open Link", `Please visit ${url} in your browser.`);
    }
  };

  const handleOpenMaps = async () => {
    triggerHaptic();
    const query = encodeURIComponent("Krishna Parisar, Indore Road, Ujjain, Madhya Pradesh 456010");
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
          <Text style={styles.headerSubBadge}>OUR MISSION & STORY</Text>
          <Text style={styles.headerTitle}>About Ujjain Tirth</Text>
        </View>

        <TouchableOpacity
          style={styles.headerHelpBtn}
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            router.push("/help-support" as any);
          }}
          accessibilityLabel="Help & Support"
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
          <View style={styles.heroTopBadge}>
            <Ionicons name="sparkles" size={14} color={COLORS.sacred} />
            <Text style={styles.heroTopBadgeText}>॥ श्री महाकालेश्वरो विजयते ॥</Text>
          </View>

          <Text style={styles.heroHeadline}>
            Ujjain’s Most Trusted Pilgrimage & Darshan Companion
          </Text>

          <Text style={styles.heroBody}>
            Welcome to <Text style={styles.boldText}>UjjainTirth.com</Text> — devoted to
            enriching your spiritual journey through holy Avantika. With over{" "}
            <Text style={styles.boldText}>14+ years of pilgrimage experience</Text> (originally
            established in 2011 as UjjainTourism.in), we bridge ancient Vedic tradition with
            modern transparency and care.
          </Text>

          {/* Quick Stats Grid */}
          <View style={styles.milestoneGrid}>
            {MILESTONES.map((item, idx) => (
              <View key={idx} style={styles.milestoneBox}>
                <Text style={styles.milestoneCount}>{item.count}</Text>
                <Text style={styles.milestoneLabel}>{item.label}</Text>
                <Text style={styles.milestoneSub}>{item.sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── WHO WE ARE SECTION ── */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: COLORS.sacredTint }]}>
              <Ionicons name="people" size={18} color={COLORS.sacred} />
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionSmallTitle}>WHO WE ARE</Text>
              <Text style={styles.sectionMainTitle}>Devotion Meets Engineering Precision</Text>
            </View>
          </View>

          <View style={styles.contentCard}>
            <Text style={styles.paragraphText}>
              Founded and managed by a dedicated team of engineers, Ujjain Tirth was born out of
              a simple vow: <Text style={styles.boldText}>no devotee should face harassment, queue confusion, or unfair pricing</Text> when
              visiting the abode of Mahakal.
            </Text>

            <View style={styles.highlightQuoteBox}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
              <Text style={styles.highlightQuoteText}>
                We combine deep reverence for Lord Shiva with operational precision—ensuring every
                detail, from priest selection to temple transfer, is handled with utmost trust.
              </Text>
            </View>

            <View style={styles.valueList}>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>
                  <Text style={styles.boldText}>Zero Middlemen:</Text> Direct connection with verified local purohits and authentic dharamshalas.
                </Text>
              </View>

              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>
                  <Text style={styles.boldText}>Transparent Dakshina:</Text> Fixed, honest ritual pricing with no hidden charges at the ghats.
                </Text>
              </View>

              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>
                  <Text style={styles.boldText}>On-Ground Support:</Text> Physical helpdesk right near Mahakaleshwar temple Gate No. 4.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── WHAT WE OFFER SECTION ── */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: COLORS.primaryTint }]}>
              <Ionicons name="grid" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionSmallTitle}>WHAT WE OFFER</Text>
              <Text style={styles.sectionMainTitle}>Complete Pilgrimage Services</Text>
            </View>
          </View>

          <View style={styles.offeringsList}>
            {WHAT_WE_OFFER.map((item) => (
              <View key={item.id} style={styles.offeringCard}>
                <View style={styles.offeringTop}>
                  <View style={[styles.offeringIconCircle, { backgroundColor: `${item.tagColor}15` }]}>
                    <Ionicons name={item.icon} size={18} color={item.tagColor} />
                  </View>
                  <View style={styles.offeringTitleWrap}>
                    <View style={styles.categoryPill}>
                      <Text style={[styles.categoryPillText, { color: item.tagColor }]}>
                        {item.category}
                      </Text>
                    </View>
                    <Text style={styles.offeringTitle}>{item.title}</Text>
                  </View>
                </View>
                <Text style={styles.offeringDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── POWERED BY GRANTH INFO TECH SECTION ── */}
        <View style={styles.techPartnerCard}>
          <View style={styles.techPartnerTopRow}>
            <View style={styles.techBadge}>
              <Ionicons name="code-slash" size={14} color="#FFF" />
              <Text style={styles.techBadgeText}>TECHNOLOGY PARTNER</Text>
            </View>
            <Text style={styles.techPlatformBadge}>Official Digital Engine</Text>
          </View>

          <View style={styles.techBrandRow}>
            <View style={styles.techIconBox}>
              <Ionicons name="laptop-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.techBrandTexts}>
              <Text style={styles.poweredBySub}>Developed &amp; Powered by</Text>
              <Text style={styles.techCompanyName}>Granth Info Tech Pvt. Ltd.</Text>
            </View>
          </View>

          <Text style={styles.techDescription}>
            The Ujjain Tirth mobile application and digital booking ecosystem are engineered,
            built, and maintained by <Text style={styles.boldText}>Granth Info Tech</Text>.
            By pairing robust cloud infrastructure and secure payment gateways with intuitive
            spiritual design, Granth Info Tech ensures that millions of devotees can book
            poojas, stays, and journeys with peace of mind.
          </Text>

          <TouchableOpacity
            style={styles.visitTechBtn}
            activeOpacity={0.8}
            onPress={() => handleOpenWebsite("https://granthinfotech.in/")}
          >
            <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
            <Text style={styles.visitTechBtnText}>Visit Granth Info Tech</Text>
            <Ionicons name="open-outline" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ── OFFICE & CONTACT DETAILS ── */}
        <View style={styles.officeCard}>
          <Text style={styles.officeHeading}>Physical Registered Office</Text>

          <View style={styles.officeRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.sacred} />
            <Text style={styles.officeText}>
              First Floor, 12/A, Krishna Parisar, Indore Road, Ujjain, Madhya Pradesh - 456010, India
            </Text>
          </View>

          <View style={styles.officeRow}>
            <Ionicons name="call-outline" size={17} color={COLORS.primary} />
            <TouchableOpacity onPress={() => handleCall("+919993612998")}>
              <Text style={[styles.officeText, styles.linkText]}>
                +91 9993612998 / {APP_CONFIG.SUPPORT_PHONE}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.officeRow}>
            <Ionicons name="mail-outline" size={17} color={COLORS.journey} />
            <Text style={styles.officeText}>info@ujjaintirth.com / ujjaintirthofficial@gmail.com</Text>
          </View>

          <View style={styles.officeActionRow}>
            <TouchableOpacity
              style={styles.mapsBtn}
              activeOpacity={0.8}
              onPress={handleOpenMaps}
            >
              <Ionicons name="navigate-outline" size={15} color={COLORS.journey} />
              <Text style={styles.mapsBtnText}>Directions in Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactDeskBtn}
              activeOpacity={0.8}
              onPress={() => {
                triggerHaptic();
                router.push("/help-support?tab=contact" as any);
              }}
            >
              <Ionicons name="chatbubbles-outline" size={15} color="#FFF" />
              <Text style={styles.contactDeskBtnText}>Contact Devotee Desk</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── DEVOTIONAL BLESSING FOOTER ── */}
        <View style={styles.devotionalFooter}>
          <Text style={styles.shloka}>॥ हर हर महादेव ॥</Text>
          <Text style={styles.brandFooter}>
            Ujjain Tirth • Empowering Sacred Journeys
          </Text>
          <Text style={styles.granthFooter}>
            Powered by Granth Info Tech Pvt. Ltd.
          </Text>
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
  headerHelpBtn: {
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
    marginBottom: 16,
    ...SHADOWS.card,
  },
  heroTopBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    gap: 6,
    marginBottom: 10,
  },
  heroTopBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    letterSpacing: 0.5,
  },
  heroHeadline: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    lineHeight: 25,
    marginBottom: 8,
  },
  heroBody: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 19,
    marginBottom: 14,
  },
  boldText: {
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },

  /* Milestone Grid */
  milestoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  milestoneBox: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.sm,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  milestoneCount: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.primary,
  },
  milestoneLabel: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginTop: 2,
    textAlign: "center",
  },
  milestoneSub: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
  },

  /* Sections */
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitleWrap: {
    flex: 1,
  },
  sectionSmallTitle: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    letterSpacing: 0.8,
  },
  sectionMainTitle: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
  },

  contentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  paragraphText: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
    marginBottom: 10,
  },
  highlightQuoteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.primaryTint,
    borderRadius: RADIUS.sm,
    padding: 10,
    gap: 8,
    marginBottom: 12,
  },
  highlightQuoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
    lineHeight: 17,
  },
  valueList: {
    gap: 8,
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  valueDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.gold,
    marginTop: 6,
  },
  valueText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 17,
  },

  /* What We Offer */
  offeringsList: {
    gap: 8,
  },
  offeringCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  offeringTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  offeringIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  offeringTitleWrap: {
    flex: 1,
  },
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceMuted,
    marginBottom: 2,
  },
  categoryPillText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    textTransform: "uppercase",
  },
  offeringTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  offeringDesc: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 16,
    marginLeft: 44,
  },

  /* Powered by Granth Info Tech */
  techPartnerCard: {
    backgroundColor: "#1C1715",
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  techPartnerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  techBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  techBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFF",
    letterSpacing: 0.6,
  },
  techPlatformBadge: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: "#D0C8BF",
  },
  techBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  techIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(235, 92, 73, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(235, 92, 73, 0.3)",
  },
  techBrandTexts: {
    flex: 1,
  },
  poweredBySub: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#A79C8E",
  },
  techCompanyName: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: "#FFF",
  },
  techDescription: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#DCD5CD",
    lineHeight: 18,
    marginBottom: 14,
  },
  visitTechBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  visitTechBtnText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
  },

  /* Office Card */
  officeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  officeHeading: {
    fontSize: 13,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 10,
  },
  officeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  officeText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 16,
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: FONTS.body.bold,
  },
  officeActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  mapsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.journeyTint,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  mapsBtnText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
  },
  contactDeskBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: RADIUS.xs,
    gap: 4,
  },
  contactDeskBtnText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFF",
  },

  /* Devotional Footer */
  devotionalFooter: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 3,
  },
  shloka: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: 0.8,
  },
  brandFooter: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  granthFooter: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkFaint,
  },
});
