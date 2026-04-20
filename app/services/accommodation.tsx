import HeroSection from "@/components/accommodation/HeroSection";
import HighlightsRow from "@/components/accommodation/HighlightsRow";
import HotelCard from "@/components/accommodation/HotelCard";
import HotelDetailModal from "@/components/accommodation/HotelDetailModal";
import LinkedPackages from "@/components/accommodation/LinkedPackages";
import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { COLORS } from "@/constants/colors";
import { useAccommodation } from "@/hooks/useAccommodation";
import { Hotel } from "@/types/service";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AccommodationScreen() {
  const { data, isLoading, isError, refetch } = useAccommodation();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleHotelPress = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setModalVisible(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedHotel(null);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSkeleton />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.container}>
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  const hasHotels = data.hotels && data.hotels.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* 1. Hero Section */}
        <HeroSection hero={data.hero} />

        {/* 2. Highlights Row (conditional) */}
        <HighlightsRow highlights={data.highlights} />

        {/* 3. Hotels Section */}
        <View style={styles.hotelsSection}>
          <Text style={styles.sectionTitle}>Where to Stay</Text>

          {hasHotels ? (
            data.hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onPress={handleHotelPress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏨</Text>
              <Text style={styles.emptyText}>No stays available</Text>
              <Text style={styles.emptySubtext}>
                Check back soon for new listings
              </Text>
            </View>
          )}
        </View>

        {/* 4. Linked Packages (conditional) */}
        <LinkedPackages packages={data.linked_packages} />

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Hotel Detail Modal */}
      <HotelDetailModal
        visible={modalVisible}
        hotel={selectedHotel}
        onClose={handleModalClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F2EA",
  },

  scrollContent: {
    flexGrow: 1,
  },

  hotelsSection: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 14,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },

  emptySubtext: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});
