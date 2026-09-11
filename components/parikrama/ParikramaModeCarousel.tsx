import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { ParikramaModeItem } from "@/types/parikrama";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  modes: ParikramaModeItem[];
  selectedModeId: number | null;
  onSelectMode: (mode: ParikramaModeItem) => void;
}

const ParikramaModeCarousel = ({
  modes,
  selectedModeId,
  onSelectMode,
}: Props) => {
  if (!modes || modes.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Choose Parikrama Mode</Text>
        <Text style={styles.sectionHint}>Swipe to explore yatras</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={288} // card width 280 + gap 8
      >
        {modes.map((mode) => {
          const isSelected = selectedModeId === mode.id;

          return (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.88}
              onPress={() => onSelectMode(mode)}
              style={[
                styles.modeCard,
                isSelected ? styles.modeCardActive : styles.modeCardInactive,
              ]}
            >
              {/* Card Image */}
              <View style={styles.imageBox}>
                <Image
                  source={{ uri: mode.image }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={250}
                />
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>
                    {mode.mode_type.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View style={styles.cardBody}>
                <Text style={styles.modeTitle} numberOfLines={1}>
                  {mode.title}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="calendar-outline" size={12} color={COLORS.journey} />
                    <Text style={styles.metaText}>{mode.duration}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Ionicons name="trail-sign-outline" size={12} color={COLORS.journey} />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {mode.distance}
                    </Text>
                  </View>
                </View>

                <Text style={styles.modeDescription} numberOfLines={2}>
                  {mode.short_description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text
                    style={[
                      styles.selectText,
                      isSelected ? styles.selectTextActive : styles.selectTextInactive,
                    ]}
                  >
                    {isSelected ? "Selected Yatra ✓" : "View Itinerary & Book"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(ParikramaModeCarousel);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    letterSpacing: -0.2,
  },
  sectionHint: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  modeCard: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    borderWidth: 1.5,
    ...SHADOWS.card,
  },
  modeCardActive: {
    borderColor: COLORS.journey,
  },
  modeCardInactive: {
    borderColor: COLORS.hairline,
  },
  imageBox: {
    width: "100%",
    height: 125,
    backgroundColor: COLORS.bgStone,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  typeBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.journey,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  typeBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.6,
  },
  cardBody: {
    padding: 14,
  },
  modeTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.journeyTint,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  metaText: {
    fontSize: 11,
    fontFamily: FONTS.body.semiBold,
    color: COLORS.journey,
  },
  modeDescription: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
  },
  selectText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },
  selectTextActive: {
    color: COLORS.journey,
  },
  selectTextInactive: {
    color: COLORS.inkMuted,
  },
});
