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
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NarmadaParikramaScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch } = useParikrama();

  const [selectedMode, setSelectedMode] = useState<ParikramaModeItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<NarmadaLocationItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Compute adaptive bottom scroll padding for Android 3-button bar & iOS home indicator
  const bottomScrollPadding = Math.max(insets.bottom, Platform.OS === "android" ? 28 : 16) + 36;

  const handleBack = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, []);

  const handleShare = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    Share.share({
      title: "Maa Narmada Parikrama - Sacred 3,450 KM Pilgrimage",
      message:
        "🙏 Maa Narmada Parikrama Sacred Pilgrimage Circuit\n\n" +
        "Explore the eternal circumambulation of Mother Narmada across Amarkantak, Omkareshwar, Maheshwar, Nemawar & Bharuch Sangam.\n\n" +
        "Plan your sacred yatra with verified stays & guidance: https://ujjaintirth.com",
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
          <Text style={styles.topBarTitle} maxFontSizeMultiplier={1.3}>
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
      {/* Devotional Persistent Top Navigation Bar */}
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
          <Text
            style={styles.topBarTitle}
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
          >
            Maa Narmada Parikrama
          </Text>
          <Text
            style={styles.topBarChant}
            numberOfLines={1}
            maxFontSizeMultiplier={1.2}
          >
            ॥ नर्मदे हर ॥ • Sacred 3,450 KM Circuit
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
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: bottomScrollPadding },
          ]}
          bounces={true}
        >
          {/* 1. Cinematic Devotional Hero Banner */}
          <ParikramaHero showBackButton={false} />

          {/* 2. Parikrama Modes & Yatras Carousel */}
          <ParikramaModeCarousel
            modes={data?.modes || []}
            selectedModeId={selectedMode?.id ?? null}
            onSelectMode={handleSelectMode}
          />

          {/* 3. Chronological Sacred River Spine Timeline */}
          <RiverSpineTimeline
            locations={data?.locations || []}
            onSelectLocation={handleSelectLocation}
          />
        </ScrollView>

        {/* Devotee Assistance & Yatra Enquiry Modal */}
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
    paddingTop: 8,
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
    letterSpacing: 0.6,
    marginTop: 2,
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
  scrollContainer: {
    paddingTop: 6,
  },
});
