import ErrorState from "@/components/common/ErrorState";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import ScreenContainer from "@/components/layout/ScreenContainer";
import ParikramaEnquiryModal from "@/components/parikrama/ParikramaEnquiryModal";
import ParikramaHero from "@/components/parikrama/ParikramaHero";
import ParikramaModeCarousel from "@/components/parikrama/ParikramaModeCarousel";
import RiverSpineTimeline from "@/components/parikrama/RiverSpineTimeline";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { useParikrama } from "@/hooks/useParikrama";
import { NarmadaLocationItem, ParikramaModeItem } from "@/types/parikrama";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NarmadaParikramaScreen() {
  const { data, isLoading, isError, refetch } = useParikrama();

  const [selectedMode, setSelectedMode] = useState<ParikramaModeItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<NarmadaLocationItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, []);

  const handleShare = useCallback(() => {
    Share.share({
      title: "Narmada Parikrama - Sacred Pilgrimage Circuit",
      message:
        "🙏 Narmada Parikrama Pilgrimage Yatra\n" +
        "Explore the sacred circumambulation of Mother Narmada across Amarkantak, Omkareshwar, Maheshwar, Nemawar & Bharuch Sangam.\n\n" +
        "Plan your pilgrimage with UjjainTirth: https://ujjaintirth.com",
    }).catch((err) => console.log("Share error:", err));
  }, []);

  const handleSelectMode = useCallback((mode: ParikramaModeItem) => {
    setSelectedMode(mode);
    setSelectedLocation(null);
    setModalVisible(true);
  }, []);

  const handleSelectLocation = useCallback((loc: NarmadaLocationItem) => {
    setSelectedLocation(loc);
    setSelectedMode(null);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedMode(null);
    setSelectedLocation(null);
  }, []);

  const locationImages = useMemo(() => {
    return (data?.locations || [])
      .map((l) => l.image)
      .filter(Boolean);
  }, [data?.locations]);

  if (isError && (!data || !data.locations || data.locations.length === 0)) {
    return (
      <ScreenContainer edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} maxFontSizeMultiplier={1.25}>
            Narmada Parikrama
          </Text>
          <View style={styles.navButtonPlaceholder} />
        </View>
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPadding edges={["top", "bottom"]}>
      {/* Persistent Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle} numberOfLines={1} maxFontSizeMultiplier={1.25}>
            Narmada Parikrama
          </Text>
          <Text style={styles.topBarChant} maxFontSizeMultiplier={1.2}>
            नर्मदे हर • Holy River Circuit
          </Text>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          activeOpacity={0.7}
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share Yatra details"
        >
          <Ionicons name="share-social-outline" size={19} color={COLORS.ink} />
        </TouchableOpacity>
      </View>

      <AvailabilityScreen
        isLoading={isLoading}
        count={data?.locations?.length || 5}
        label="Sacred River Stops"
        subtitle="Amarkantak, Omkareshwar & Maheshwar"
        images={locationImages}
        revealDurationMs={650}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
        >
          {/* Sacred River Banner Header */}
          <ParikramaHero showBackButton={false} />

          {/* 1. Mode Selection Carousel */}
          <ParikramaModeCarousel
            modes={data?.modes || []}
            selectedModeId={selectedMode?.id ?? null}
            onSelectMode={handleSelectMode}
          />

          {/* 2. Chronological Sacred River Spine Timeline */}
          <RiverSpineTimeline
            locations={data?.locations || []}
            onSelectLocation={handleSelectLocation}
          />

          <View style={{ height: 32 }} />
        </ScrollView>

        {/* Yatra Enquiry Modal */}
        <ParikramaEnquiryModal
          visible={modalVisible}
          mode={selectedMode}
          location={selectedLocation}
          onClose={handleCloseModal}
        />
      </AvailabilityScreen>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.hairline,
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  topBarTitle: {
    fontSize: 17,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  topBarChant: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.journey,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.subtle,
  },
  navButtonPlaceholder: {
    width: 38,
  },
  loadingWrapper: {
    paddingHorizontal: 16,
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 8,
    paddingBottom: 28,
  },
});
