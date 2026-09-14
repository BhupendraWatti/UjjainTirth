import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaItem } from "@/types/pooja";

interface PoojaWorkflowTabProps {
  item: PoojaItem;
}

export const PoojaWorkflowTab: React.FC<PoojaWorkflowTabProps> = ({ item }) => {
  const steps = item.workflow_steps || [];

  return (
    <Animated.View entering={FadeIn.duration(280)} style={styles.container}>
      {/* Live WhatsApp Video Sankalp Devotee Reassurance Banner */}
      <View style={styles.liveAssuranceCard}>
        <View style={styles.liveIndicatorRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveTagText}>LIVE REMOTE SANKALP</Text>
        </View>
        <Text style={styles.liveAssuranceTitle}>
          Individual WhatsApp Video Darshan
        </Text>
        <Text style={styles.liveAssuranceDesc}>
          Cannot visit Ujjain in person? The presiding Shastri connects with you directly via WhatsApp
          video call to chant your specific Gotra Sankalp before initiating the sacred Vidhi.
        </Text>
      </View>

      {/* Step-by-Step Shastric Ritual Procedure */}
      <View style={styles.workflowSection}>
        <View style={styles.headingBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.workflowTitle}>Vedic Anushthan Vidhi</Text>
            {item.badge_tag ? (
              <View style={styles.badgeTagPill}>
                <Text style={styles.badgeTagText}>{item.badge_tag}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.workflowSubtitle}>
            Authentic Shastric Procedure ({steps.length} Stages)
          </Text>
        </View>

        {steps.length > 0 ? (
          <View style={styles.timelineContainer}>
            {steps.map((step, sIdx) => {
              const isLast = sIdx === steps.length - 1;
              const stepNum = step.step_number || sIdx + 1;
              const isSankalp = sIdx === 0;

              return (
                <View key={`step-${stepNum}`} style={styles.timelineItem}>
                  <View style={styles.timelineIndicatorCol}>
                    <View
                      style={[
                        styles.timelineDot,
                        isSankalp && styles.timelineDotActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.timelineDotText,
                          isSankalp && styles.timelineDotTextActive,
                        ]}
                      >
                        {stepNum}
                      </Text>
                    </View>
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>

                  <View
                    style={[
                      styles.timelineContent,
                      !isLast && styles.timelineContentSpacing,
                    ]}
                  >
                    <View style={styles.stepTitleRow}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      {isSankalp && (
                        <View style={styles.sankalpBadge}>
                          <Text style={styles.sankalpBadgeText}>YOUR SANKALP</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.stepDesc}>{step.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.fallbackText}>
            Ritual procedure is strictly guided on-site by the attending Shastri
            according to your horoscope and family Gotra.
          </Text>
        )}
      </View>

      {/* Hereditary Purohit Trust Guarantee */}
      <View style={styles.purohitTrustCard}>
        <Text style={styles.purohitTrustTag}>VEDIC AUTHORITY</Text>
        <Text style={styles.purohitTitle}>Certified Hereditary Ujjain Shastris</Text>
        <Text style={styles.purohitDesc}>
          Rituals are conducted strictly by traditional Ujjain Gurukul-trained Acharyas
          maintaining ancient Agamic traditions and precise Sanskrit phonetics.
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  liveAssuranceCard: {
    backgroundColor: "rgba(35, 12, 16, 0.05)",
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.18)",
  },
  liveIndicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.whatsapp,
  },
  liveTagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
    letterSpacing: 0.6,
  },
  liveAssuranceTitle: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  liveAssuranceDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
  },
  workflowSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  headingBlock: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  workflowTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  workflowSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  badgeTagPill: {
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  badgeTagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  timelineContainer: {
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  timelineIndicatorCol: {
    width: 28,
    alignItems: "center",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1.5,
    borderColor: COLORS.hairline,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  timelineDotActive: {
    backgroundColor: COLORS.sacred,
    borderColor: COLORS.sacred,
  },
  timelineDotText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
  },
  timelineDotTextActive: {
    color: "#FFFFFF",
  },
  timelineLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: "rgba(124, 31, 43, 0.15)",
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineContentSpacing: {
    paddingBottom: 18,
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
    flexWrap: "wrap",
  },
  stepTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  sankalpBadge: {
    backgroundColor: "rgba(184, 128, 46, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sankalpBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  stepDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
  },
  fallbackText: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 19,
    fontStyle: "italic",
  },
  purohitTrustCard: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
  },
  purohitTrustTag: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  purohitTitle: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 4,
  },
  purohitDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 18,
  },
});
