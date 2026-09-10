import ErrorState from "@/components/common/ErrorState";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import ScreenContainer from "@/components/layout/ScreenContainer";
import ParikramaEnquiryModal from "@/components/parikrama/ParikramaEnquiryModal";
import ParikramaHero from "@/components/parikrama/ParikramaHero";
import ParikramaModeCarousel from "@/components/parikrama/ParikramaModeCarousel";
import RiverSpineTimeline from "@/components/parikrama/RiverSpineTimeline";
import { useParikrama } from "@/hooks/useParikrama";
import { NarmadaLocationItem, ParikramaModeItem } from "@/types/parikrama";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function NarmadaParikramaScreen() {
  const { data, isLoading, isError, refetch } = useParikrama();

  const [selectedMode, setSelectedMode] = useState<ParikramaModeItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<NarmadaLocationItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
      <ScreenContainer>
        <ParikramaHero />
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
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
          <ParikramaHero />

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
  loadingWrapper: {
    paddingHorizontal: 16,
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 24,
  },
});
