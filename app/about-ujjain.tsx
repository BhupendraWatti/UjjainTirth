import ScreenContainer from "@/components/layout/ScreenContainer";
import { Text } from "@/components/ui/AppText";
import { COLORS } from "@/constants/colors";
import { HIT_SLOP } from "@/constants/layout";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface InfoItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  tagColor: string;
}

const QUICK_FACTS = [
  { value: "5000+", label: "Years Old", sub: "Ancient Avantika" },
  { value: "1 of 12", label: "Jyotirlingas", sub: "Shree Mahakal" },
  { value: "1 of 7", label: "Moksha Puris", sub: "Saptapuri" },
  { value: "12 Yrs", label: "Simhastha Kumbh", sub: "On the Shipra" },
];

const SACRED_PLACES: InfoItem[] = [
  {
    id: "mahakal",
    icon: "flame-outline",
    title: "Shree Mahakaleshwar Jyotirlinga",
    description:
      "The only south-facing (Dakshinamukhi) Jyotirlinga, world famous for the pre-dawn Bhasma Aarti.",
    tagColor: COLORS.sacred,
  },
  {
    id: "kalbhairav",
    icon: "shield-outline",
    title: "Kal Bhairav Temple",
    description:
      "The Kotwal (guardian) of Ujjain. A visit here is considered essential to complete the Mahakal yatra.",
    tagColor: COLORS.sacred,
  },
  {
    id: "harsiddhi",
    icon: "sparkles-outline",
    title: "Harsiddhi Mata Shaktipeeth",
    description:
      "One of the 51 Shaktipeeths, known for its towering deepstambhas lit with hundreds of lamps at evening aarti.",
    tagColor: COLORS.primary,
  },
  {
    id: "ramghat",
    icon: "water-outline",
    title: "Ram Ghat & Shipra River",
    description:
      "The holiest ghat of Ujjain and the main bathing site during Simhastha. The evening Shipra aarti is unmissable.",
    tagColor: COLORS.journey,
  },
  {
    id: "mangalnath",
    icon: "planet-outline",
    title: "Mangalnath Temple",
    description:
      "Revered as the birthplace of Mangal (Mars). Devotees perform Mangal Dosh nivaran pooja here.",
    tagColor: COLORS.primary,
  },
  {
    id: "sandipani",
    icon: "book-outline",
    title: "Sandipani Ashram",
    description:
      "The gurukul where Lord Krishna, Balram and Sudama studied under Maharishi Sandipani.",
    tagColor: COLORS.gold,
  },
  {
    id: "gadkalika",
    icon: "rose-outline",
    title: "Gadkalika Temple",
    description:
      "Ancient temple of Maa Kalika, believed to be the deity worshipped by the great poet Kalidasa.",
    tagColor: COLORS.sacred,
  },
  {
    id: "vedhshala",
    icon: "telescope-outline",
    title: "Vedh Shala (Observatory)",
    description:
      "Built by Maharaja Jai Singh II. Ujjain was once the prime meridian of Indian astronomy.",
    tagColor: COLORS.journey,
  },
];

const VISIT_TIPS: InfoItem[] = [
  {
    id: "season",
    icon: "sunny-outline",
    title: "Best Time to Visit",
    description:
      "October to March offers pleasant weather. Mahashivratri and the holy month of Shravan are the most auspicious, but also the most crowded.",
    tagColor: COLORS.gold,
  },
  {
    id: "air",
    icon: "airplane-outline",
    title: "By Air",
    description:
      "Nearest airport is Devi Ahilyabai Holkar Airport, Indore — about 55 km (around 1.5 hours by road).",
    tagColor: COLORS.journey,
  },
  {
    id: "rail",
    icon: "train-outline",
    title: "By Train",
    description:
      "Ujjain Junction is well connected to Delhi, Mumbai, Ahmedabad, Bhopal and most major cities.",
    tagColor: COLORS.journey,
  },
  {
    id: "road",
    icon: "car-outline",
    title: "By Road",
    description:
      "Good highways connect Ujjain to Indore, Bhopal and Omkareshwar. Cabs are the easiest way to cover all temples.",
    tagColor: COLORS.journey,
  },
];

export default function AboutUjjainScreen() {
  const triggerHaptic = (
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
  ) => {
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

  const goToPackages = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/packages");
  };

  const goToTemples = () => {
    triggerHaptic();
    router.push("/(tabs)/temples");
  };

  const renderInfoCard = (item: InfoItem) => (
    <View key={item.id} style={styles.infoCard}>
      <View
        style={[styles.infoIconCircle, { backgroundColor: `${item.tagColor}15` }]}
      >
        <Ionicons name={item.icon} size={18} color={item.tagColor} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoTitle}>{item.title}</Text>
        <Text style={styles.infoDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <ScreenContainer noPadding>
      {/* ── TOP HEADER ── */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerSubBadge}>THE CITY OF MAHAKAL</Text>
          <Text style={styles.headerTitle}>About Ujjain</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO ── */}
        <View style={styles.heroWrap}>
          <Image
            source={require("@/assets/images/Mahakaleshwar-1.jpeg")}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(78, 5, 26, 0.92)"]}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroShloka}>॥ जय श्री महाकाल ॥</Text>
            <Text style={styles.heroTitle}>Ujjain — Avantika</Text>
            <Text style={styles.heroSubtitle}>
              One of India's oldest living cities, on the banks of the holy Shipra
            </Text>
          </LinearGradient>
        </View>

        {/* ── QUICK FACTS ── */}
        <View style={styles.factsGrid}>
          {QUICK_FACTS.map((fact) => (
            <View key={fact.label} style={styles.factBox}>
              <Text style={styles.factValue}>{fact.value}</Text>
              <Text style={styles.factLabel}>{fact.label}</Text>
              <Text style={styles.factSub}>{fact.sub}</Text>
            </View>
          ))}
        </View>

        {/* ── HISTORY ── */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: COLORS.sacredTint }]}>
              <Ionicons name="library" size={18} color={COLORS.sacred} />
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionSmallTitle}>HISTORY & HERITAGE</Text>
              <Text style={styles.sectionMainTitle}>A City Beyond Time</Text>
            </View>
          </View>

          <View style={styles.contentCard}>
            <Text style={styles.paragraphText}>
              Known in ancient texts as <Text style={styles.boldText}>Avantika</Text>,{" "}
              <Text style={styles.boldText}>Ujjayini</Text> and{" "}
              <Text style={styles.boldText}>Kanakashringa</Text>, Ujjain has been a centre of
              faith, learning and trade for thousands of years. It is one of the seven{" "}
              <Text style={styles.boldText}>Moksha-dayini Puris</Text> of Hinduism.
            </Text>
            <Text style={styles.paragraphText}>
              It was the capital of the legendary{" "}
              <Text style={styles.boldText}>King Vikramaditya</Text>, the home of the poet{" "}
              <Text style={styles.boldText}>Kalidasa</Text>, and the place where Lord Krishna
              received his education at Sandipani Ashram.
            </Text>

            <View style={styles.highlightQuoteBox}>
              <Ionicons name="water" size={20} color={COLORS.journey} />
              <Text style={styles.highlightQuoteText}>
                Every 12 years, Ujjain hosts the{" "}
                <Text style={styles.boldText}>Simhastha Kumbh Mela</Text> — when crores of
                devotees take a holy dip in the Shipra. The next Simhastha is in 2028.
              </Text>
            </View>
          </View>
        </View>

        {/* ── SACRED PLACES ── */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: COLORS.primaryTint }]}>
              <Ionicons name="location" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionSmallTitle}>MUST-VISIT</Text>
              <Text style={styles.sectionMainTitle}>Sacred Places of Ujjain</Text>
            </View>
          </View>

          <View style={styles.list}>{SACRED_PLACES.map(renderInfoCard)}</View>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={goToTemples}
          >
            <Text style={styles.secondaryBtnText}>Explore All Temples</Text>
            <Ionicons name="arrow-forward" size={15} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ── PLAN YOUR VISIT ── */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: COLORS.journeyTint }]}>
              <Ionicons name="map" size={18} color={COLORS.journey} />
            </View>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionSmallTitle}>PLAN YOUR VISIT</Text>
              <Text style={styles.sectionMainTitle}>When to Go & How to Reach</Text>
            </View>
          </View>

          <View style={styles.list}>{VISIT_TIPS.map(renderInfoCard)}</View>
        </View>

        {/* ── CTA ── */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaCard}
        >
          <Text style={styles.ctaTitle}>Ready for your Ujjain Yatra?</Text>
          <Text style={styles.ctaBody}>
            Darshan, stay, cabs and pooja — all in one hassle-free package.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.85}
            onPress={goToPackages}
          >
            <Text style={styles.ctaBtnText}>View Packages</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </LinearGradient>

        {/* ── FOOTER ── */}
        <View style={styles.devotionalFooter}>
          <Text style={styles.shloka}>॥ हर हर महादेव ॥</Text>
          <Text style={styles.brandFooter}>Ujjain Tirth • Empowering Sacred Journeys</Text>
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
    flexShrink: 1,
  },
  headerSubBadge: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginTop: 1,
  },
  headerSpacer: {
    width: 38,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Hero */
  heroWrap: {
    height: 210,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginBottom: 12,
    ...SHADOWS.card,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    padding: 16,
  },
  heroShloka: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.goldLight,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: FONTS.display.semiBold,
    color: "#FFF",
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: "#F3E9DF",
    marginTop: 2,
    lineHeight: 18,
  },

  /* Quick facts */
  factsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  factBox: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  factValue: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.primary,
  },
  factLabel: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginTop: 2,
    textAlign: "center",
  },
  factSub: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
  },

  /* Sections */
  sectionBlock: {
    marginBottom: 18,
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
    fontSize: 11,
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
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 19,
    marginBottom: 10,
  },
  boldText: {
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  highlightQuoteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.journeyTint,
    borderRadius: RADIUS.sm,
    padding: 10,
    gap: 8,
  },
  highlightQuoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
    lineHeight: 17,
  },

  /* Info cards */
  list: {
    gap: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  infoIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTexts: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 17,
  },

  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryTint,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
  },

  /* CTA */
  ctaCard: {
    borderRadius: RADIUS.md,
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: "#FFF",
  },
  ctaBody: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: "#FFF1EC",
    marginTop: 4,
    marginBottom: 14,
    lineHeight: 18,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  ctaBtnText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
  },

  /* Footer */
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
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
});
