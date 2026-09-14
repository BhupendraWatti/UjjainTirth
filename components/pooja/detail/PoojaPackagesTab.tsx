import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { PoojaDakshinaTier, PoojaItem } from "@/types/pooja";

interface PoojaPackagesTabProps {
  item: PoojaItem;
  selectedTier: PoojaDakshinaTier | null;
  onSelectTier: (tier: PoojaDakshinaTier) => void;
}

export const PoojaPackagesTab: React.FC<PoojaPackagesTabProps> = ({
  item,
  selectedTier,
  onSelectTier,
}) => {
  const tiers = item.dakshina_tiers || [];
  const samagriList = item.samagri_list || [];
  const whatWeProvide = item.what_we_provide || [];

  return (
    <Animated.View entering={FadeIn.duration(280)} style={styles.container}>
      {/* Dakshina Tiers / Seva Packages Selection */}
      {tiers.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.headingBlock}>
            <Text style={styles.sectionTitle}>Select Dakshina Package</Text>
            <Text style={styles.sectionSubtitle}>
              Choose number of Brahmins & Anushthan scope
            </Text>
          </View>

          <View style={styles.tierContainer}>
            {tiers.map((t, idx) => {
              const isSelected =
                selectedTier?.title === t.title ||
                (!selectedTier && idx === 0);
              const isPopular = idx === 1;

              return (
                <TouchableOpacity
                  key={`tier-${idx}`}
                  activeOpacity={0.82}
                  onPress={() => onSelectTier(t)}
                  style={[
                    styles.tierCard,
                    isSelected
                      ? styles.tierCardActive
                      : styles.tierCardInactive,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${t.title}, ₹${t.price || "Custom"}`}
                >
                  {isPopular && (
                    <View style={styles.popularRibbon}>
                      <Text style={styles.popularRibbonText}>
                        MOST CHOSEN • सर्वाधिक चयनित
                      </Text>
                    </View>
                  )}

                  <View style={styles.tierHeader}>
                    <View style={styles.tierTitleCol}>
                      <Text
                        style={[
                          styles.tierTitle,
                          isSelected && styles.tierTitleActive,
                        ]}
                      >
                        {t.title}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Text style={styles.selectedBadgeText}>SELECTED</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.tierPrice}>
                      {t.price ? `₹${t.price.toLocaleString("en-IN")}` : "Custom"}
                    </Text>
                  </View>

                  {t.description ? (
                    <Text style={styles.tierDesc}>{t.description}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* 100% Pure Mandir Samagri Dravya Grid */}
      {samagriList.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.headingBlock}>
            <Text style={styles.sectionTitle}>100% Pure Mandir Samagri</Text>
            <Text style={styles.sectionSubtitle}>
              Sacred Dravya prepared strictly according to Vedic Shastras
            </Text>
          </View>

          <View style={styles.samagriChipsContainer}>
            {samagriList.map((samagri, sIdx) => (
              <View key={`samagri-${sIdx}`} style={styles.samagriChip}>
                <Text style={styles.samagriChipBullet}>•</Text>
                <Text style={styles.samagriChipText}>{samagri}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* What UjjainTirth Provides (Strictly mapped to backend API icons) */}
      {whatWeProvide.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.headingBlock}>
            <Text style={styles.sectionTitle}>Consecrated Deliverables</Text>
            <Text style={styles.sectionSubtitle}>
              Pavitra Sankalp & Devotee Assurance
            </Text>
          </View>

          <View style={styles.provideList}>
            {whatWeProvide.map((prov, pIdx) => {
              // Dynamic mapping strictly respecting the backend's prov.icon
              const iconName: keyof typeof Ionicons.glyphMap =
                prov.icon === "cube"
                  ? "cube-outline"
                  : prov.icon === "videocam"
                  ? "videocam-outline"
                  : prov.icon === "sparkles"
                  ? "sparkles-outline"
                  : "shield-checkmark-outline";

              return (
                <View key={`prov-${pIdx}`} style={styles.provideCard}>
                  <View style={styles.provideIconWrap}>
                    <Ionicons
                      name={iconName}
                      size={18}
                      color={COLORS.sacred}
                    />
                  </View>
                  <View style={styles.provideTextCol}>
                    <Text style={styles.provideTitle}>{prov.title}</Text>
                    <Text style={styles.provideDesc}>{prov.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* How Booking Works */}
      <View style={styles.sectionCard}>
        <View style={styles.headingBlock}>
          <Text style={styles.sectionTitle}>Booking & Vidhi Journey</Text>
          <Text style={styles.sectionSubtitle}>
            How your sacred Anushthan is performed
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Select Package & Request</Text>
              <Text style={styles.stepSub}>
                Choose your desired Dakshina tier and connect with our Vedic coordinator.
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Share Yajman Gotra & Intentions</Text>
              <Text style={styles.stepSub}>
                Provide names, birth details, and specific Sankalp wishes for the ritual.
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Live WhatsApp Video Sankalp</Text>
              <Text style={styles.stepSub}>
                Join the Shastri live on video during your Gotra Sankalp recitation.
              </Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>Prasad & Consecrated Items Dispatch</Text>
              <Text style={styles.stepSub}>
                Energized dry fruits, Raksha Sutra, Bhasma & Yantra delivered to your home.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  headingBlock: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },
  tierContainer: {
    gap: 12,
  },
  tierCard: {
    borderRadius: RADIUS.sm,
    padding: 14,
    borderWidth: 1.5,
    position: "relative",
  },
  tierCardActive: {
    backgroundColor: "rgba(124, 31, 43, 0.04)",
    borderColor: COLORS.sacred,
  },
  tierCardInactive: {
    backgroundColor: COLORS.surfaceMuted,
    borderColor: COLORS.hairline,
  },
  popularRibbon: {
    position: "absolute",
    top: -10,
    right: 14,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 3,
  },
  popularRibbonText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tierTitleCol: {
    flex: 1,
    marginRight: 10,
  },
  tierTitle: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  tierTitleActive: {
    color: COLORS.sacred,
  },
  selectedBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.sacred,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 4,
  },
  selectedBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  tierPrice: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
  },
  tierDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    marginTop: 6,
    lineHeight: 18,
  },
  samagriChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  samagriChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(43, 36, 32, 0.04)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "rgba(43, 36, 32, 0.07)",
  },
  samagriChipBullet: {
    fontSize: 12,
    color: COLORS.sacred,
  },
  samagriChipText: {
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: COLORS.ink,
  },
  provideList: {
    gap: 12,
  },
  provideCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(124, 31, 43, 0.03)",
    borderRadius: RADIUS.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.10)",
    gap: 12,
  },
  provideIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.12)",
  },
  provideTextCol: {
    flex: 1,
  },
  provideTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
    marginBottom: 2,
  },
  provideDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 17,
  },
  stepContainer: {
    gap: 14,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  stepTextContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.ink,
  },
  stepSub: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
    lineHeight: 17,
  },
});
