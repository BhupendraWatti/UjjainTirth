import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaItem } from "@/types/pooja";

interface PoojaOverviewTabProps {
  item: PoojaItem;
}

export const PoojaOverviewTab: React.FC<PoojaOverviewTabProps> = ({ item }) => {
  return (
    <Animated.View entering={FadeIn.duration(280)} style={styles.container}>
      {/* Auspicious Panchang Muhurat Card */}
      {item.muhurat_timings ? (
        <View style={styles.panchangCard}>
          <View style={styles.panchangHeader}>
            <View style={styles.panchangTag}>
              <Text style={styles.panchangTagText}>शुभ मुहूर्त • PANCHANG</Text>
            </View>
          </View>
          <Text style={styles.panchangTimingText}>
            {item.muhurat_timings}
          </Text>
        </View>
      ) : null}

      {/* Sacred Lore & Puranic Significance (Editorial Storytelling) */}
      <View style={styles.editorialSection}>
        <View style={styles.headingBlock}>
          <Text style={styles.editorialTitle}>Sacred Lore & Significance</Text>
          <Text style={styles.editorialSubtitle}>
            Puranic origins and divine spiritual context
          </Text>
        </View>

        <View style={styles.loreCallout}>
          <Text style={styles.loreText}>
            {item.description && item.description.trim() !== ""
              ? item.description
              : item.short_purpose}
          </Text>
        </View>
      </View>

      {/* Astrological Benefits & Dosh Nivaran (Clean Editorial List) */}
      {item.benefits && item.benefits.length > 0 ? (
        <View style={styles.editorialSection}>
          <View style={styles.headingBlock}>
            <Text style={styles.editorialTitle}>Benefits & Dosh Nivaran</Text>
            <Text style={styles.editorialSubtitle}>
              Astrological remedies & blessings conferred through this Vidhi
            </Text>
          </View>

          <View style={styles.benefitsList}>
            {item.benefits.map((benefit, i) => (
              <View key={`b-${i}`} style={styles.benefitItem}>
                <View style={styles.benefitPip}>
                  <Text style={styles.benefitPipNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Temple Provenance & Sanctum Sanctorum */}
      <View style={styles.templeProvenanceCard}>
        <Text style={styles.provenanceTag}>SANCTUM SANCTORUM</Text>
        <Text style={styles.provenanceTitle}>{item.temple}</Text>
        <Text style={styles.provenanceDesc}>
          This ritual is performed on-site at {item.temple} in holy
          Ujjain by authorized hereditary Tirtha Purohits observing strict Vedic Shastras.
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  panchangCard: {
    backgroundColor: "rgba(184, 128, 46, 0.07)",
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(184, 128, 46, 0.28)",
  },
  panchangHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  panchangTag: {
    backgroundColor: "rgba(184, 128, 46, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  panchangTagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 0.6,
  },
  panchangTimingText: {
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
    lineHeight: 19,
  },
  editorialSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  headingBlock: {
    marginBottom: 12,
  },
  editorialTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  editorialSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  loreCallout: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.sacred,
    paddingLeft: 12,
    marginTop: 2,
  },
  loreText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 22,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 2,
  },
  benefitPip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(184, 128, 46, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  benefitPipNumber: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
  },
  benefitText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    flex: 1,
    lineHeight: 20,
  },
  templeProvenanceCard: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  provenanceTag: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  provenanceTitle: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  provenanceDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
  },
});
