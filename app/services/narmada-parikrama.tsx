import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ScreenContainer from "@/components/layout/ScreenContainer";
import ParikramaEnquiryModal from "@/components/parikrama/ParikramaEnquiryModal";
import ParikramaHero from "@/components/parikrama/ParikramaHero";
import ParikramaModeCarousel from "@/components/parikrama/ParikramaModeCarousel";
import RiverSpineTimeline from "@/components/parikrama/RiverSpineTimeline";
import { useParikrama } from "@/hooks/useParikrama";
import { NarmadaLocationItem, ParikramaModeItem } from "@/types/parikrama";
import React, { useCallback, useState } from "react";
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

  if (isLoading) {
    return (
      <ScreenContainer>
        <ParikramaHero />
        <View style={styles.loadingWrapper}>
          <LoadingSkeleton />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer>
        <ParikramaHero />
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
      >
        {/* Sacred River Banner Header */}
        <ParikramaHero />

        {/* 1. Mode Selection Carousel */}
        <ParikramaModeCarousel
          modes={data.modes}
          selectedModeId={selectedMode?.id ?? null}
          onSelectMode={handleSelectMode}
        />

        {/* 2. Chronological Sacred River Spine Timeline */}
        <RiverSpineTimeline
          locations={data.locations}
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
