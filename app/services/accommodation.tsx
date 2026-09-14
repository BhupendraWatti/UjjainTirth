import AccommodationHero from "@/components/accommodation/AccommodationHero";
import DistanceFilterRow, { DistanceFilterType } from "@/components/accommodation/DistanceFilterRow";
import DevoteeGuarantees from "@/components/accommodation/DevoteeGuarantees";
import HotelCard from "@/components/accommodation/HotelCard";
import TirthShuddhiBanner from "@/components/accommodation/TirthShuddhiBanner";
import LinkedPackages from "@/components/accommodation/LinkedPackages";
import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { useAccommodation } from "@/hooks/useAccommodation";
import { enrichHotel, EnrichedHotel } from "@/utils/accommodationAdapter";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export default function AccommodationScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const cardWidth = isTablet ? (width - 44) / 2 : "100%";

  const { data, isLoading, isError, refetch } = useAccommodation();
  const [searchQuery, setSearchQuery] = useState("");
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilterType>("all");

  // Enrich all hotels with Stitch specifications
  const enrichedHotels = useMemo<EnrichedHotel[]>(() => {
    if (!data?.hotels) return [];
    return data.hotels.map(enrichHotel);
  }, [data]);

  // Client-side search and distance filtering
  const filteredHotels = useMemo(() => {
    let result = enrichedHotels;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.category.toLowerCase().includes(q) ||
          h.amenities.some((a) => a.name.toLowerCase().includes(q))
      );
    }

    // Distance filter
    if (distanceFilter === "under_500m") {
      result = result.filter((h) => h.distance_meters <= 500);
    } else if (distanceFilter === "500m_2km") {
      result = result.filter(
        (h) => h.distance_meters > 500 && h.distance_meters <= 2000
      );
    } else if (distanceFilter === "2km_5km") {
      result = result.filter(
        (h) => h.distance_meters > 2000 && h.distance_meters <= 5000
      );
    } else if (distanceFilter === "near_station") {
      result = result.filter(
        (h) =>
          h.location.toLowerCase().includes("station") ||
          h.location.toLowerCase().includes("railway")
      );
      // If none match strictly, fallback to all so screen is never accidentally empty
      if (result.length === 0) result = enrichedHotels;
    }

    return result;
  }, [enrichedHotels, searchQuery, distanceFilter]);

  const handleHotelPress = useCallback((hotel: EnrichedHotel) => {
    router.push({
      pathname: "/services/accommodation-detail",
      params: { id: hotel.id },
    });
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. Atmospheric Dusk Hero Section with Floating Search Bar */}
        <AccommodationHero
          hero={data.hero}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 2. Sacred Proximity Quick Navigation (Distance Filter Chips) */}
        <DistanceFilterRow
          selectedFilter={distanceFilter}
          onSelectFilter={setDistanceFilter}
        />

        {/* 3. Devotee Guarantee & Feature Badges */}
        <DevoteeGuarantees highlights={data.highlights} />

        {/* 4. Editorial Stays Listing Section Header */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTag}>SANCTUM SANCTORUM PROXIMITY</Text>
            <Text style={styles.sectionTitle}>Recommended Stays</Text>
          </View>
          <Text style={styles.availableCount}>
            {filteredHotels.length} Available
          </Text>
        </View>

        {/* 5. Hotels Cards List */}
        {filteredHotels.length > 0 ? (
          <View style={isTablet ? styles.hotelsGrid : undefined}>
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onPress={handleHotelPress}
                style={isTablet ? { width: cardWidth, marginHorizontal: 0 } : undefined}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏨</Text>
            <Text style={styles.emptyText}>
              {data.hotels.length === 0
                ? "No Accommodations Listed Yet"
                : "No matching stays found"}
            </Text>
            <Text style={styles.emptySubtext}>
              {data.hotels.length === 0
                ? "Accommodations will appear here once published from the store dashboard."
                : "Try adjusting your search query or distance filter."}
            </Text>
          </View>
        )}

        {/* 6. Tirth Shuddhi Trust Banner */}
        <TirthShuddhiBanner title={data.tagline} description={data.description} />

        {/* 7. Linked Packages */}
        <LinkedPackages packages={data.linked_packages} />

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTag: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
    marginTop: 1,
  },
  availableCount: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#877274",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingBottom: 2,
  },
  hotelsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 36,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
    ...SHADOWS.xs,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#544244",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
