import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import AboutSanctuary from "@/components/accommodation/detail/AboutSanctuary";
import GalleryHeader from "@/components/accommodation/detail/GalleryHeader";
import RoomSelection from "@/components/accommodation/detail/RoomSelection";
import SacredProximityIndex from "@/components/accommodation/detail/SacredProximityIndex";
import SacredRouteTimeline from "@/components/accommodation/detail/SacredRouteTimeline";
import SegmentedTabs, { DetailTabType } from "@/components/accommodation/detail/SegmentedTabs";
import YatraAmenities from "@/components/accommodation/detail/YatraAmenities";
import HotelBookingModal from "@/components/accommodation/HotelBookingModal";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { useAccommodation } from "@/hooks/useAccommodation";
import { RoomTier } from "@/types/service";
import { enrichHotel, EnrichedHotel } from "@/utils/accommodationAdapter";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

export default function AccommodationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, refetch } = useAccommodation();

  const [activeTab, setActiveTab] = useState<DetailTabType>("overview");
  const [selectedRoom, setSelectedRoom] = useState<RoomTier | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  // Find and enrich the hotel
  const enrichedHotel: EnrichedHotel | null = useMemo(() => {
    if (!data?.hotels || data.hotels.length === 0) return null;
    const raw = data.hotels.find((h) => h.id === id) || data.hotels[0];
    return enrichHotel(raw);
  }, [data, id]);

  // Set default selected room once hotel is resolved
  useEffect(() => {
    if (enrichedHotel && enrichedHotel.rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(enrichedHotel.rooms[0]);
    }
  }, [enrichedHotel, selectedRoom]);

  const handleShare = async () => {
    if (!enrichedHotel) return;
    try {
      await Share.share({
        title: enrichedHotel.name,
        message: `Check out ${enrichedHotel.name} near Mahakaleshwar Temple on UjjainTirth: https://ujjaintirth.com/service/accommodation`,
      });
    } catch {
      // Ignored
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSkeleton />
      </View>
    );
  }

  if (isError || !enrichedHotel) {
    return (
      <View style={styles.centerContainer}>
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  const currentRoom = selectedRoom || (enrichedHotel.rooms.length > 0 ? enrichedHotel.rooms[0] : null);
  const activePrice = currentRoom ? currentRoom.price : enrichedHotel.price;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        bounces={false}
      >
        {/* 1. Immersive Hero Gallery with Tirth Shuddhi Badge */}
        <GalleryHeader hotel={enrichedHotel} onShare={handleShare} />

        {/* 2. Property Header */}
        <View style={styles.propertyHeader}>
          <View style={styles.titleRatingRow}>
            <Text style={styles.propertyName}>{enrichedHotel.name}</Text>
            {enrichedHotel.rating > 0 ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#FFDF98" />
                <Text style={styles.ratingText}>{enrichedHotel.rating.toFixed(1)}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location-sharp" size={13} color="#904D00" />
            <Text style={styles.locationMeta}>{enrichedHotel.location}</Text>
            {enrichedHotel.property_badge ? (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.badgeMeta}>{enrichedHotel.property_badge}</Text>
              </>
            ) : null}
          </View>

          {enrichedHotel.about_text ? (
            <Text style={styles.editorialLead}>
              {enrichedHotel.about_text}
            </Text>
          ) : null}
        </View>

        {/* 3. Sacred Proximity Index Card (with Bhasma Aarti Advantage & Walking Checkpoints) */}
        <SacredProximityIndex hotel={enrichedHotel} />

        {/* 4. Segmented Tabs */}
        <SegmentedTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          hasRooms={enrichedHotel.rooms.length > 0}
          roomCount={enrichedHotel.rooms.length}
          hasAmenities={enrichedHotel.amenities.length > 0}
          hasRoute={enrichedHotel.nearby_shrines.length > 0}
        />

        {/* 5. Tab Content Sections */}
        {activeTab === "overview" && (
          <>
            <AboutSanctuary hotel={enrichedHotel} />
            <YatraAmenities amenities={enrichedHotel.amenities} />
          </>
        )}

        {activeTab === "rooms" && (
          <RoomSelection
            rooms={enrichedHotel.rooms}
            selectedRoomId={currentRoom?.id || ""}
            onSelectRoom={(room) => setSelectedRoom(room)}
          />
        )}

        {activeTab === "amenities" && (
          <YatraAmenities amenities={enrichedHotel.amenities} />
        )}

        {activeTab === "route" && (
          <SacredRouteTimeline nodes={enrichedHotel.nearby_shrines} />
        )}
      </ScrollView>

      {/* 6. Sticky Bottom Sacred Booking Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(14, insets.bottom + 8) },
        ]}
      >
        <View style={styles.bottomBarContent}>
          {/* Price details */}
          <View>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>
                ₹{activePrice.toLocaleString("en-IN")}
              </Text>
              <Text style={styles.priceUnit}> / night</Text>
            </View>
            <View style={styles.taxReassurance}>
              <Ionicons name="checkmark-circle" size={12} color="#904D00" />
              <Text style={styles.taxReassuranceText}>
                Taxes incl. • Free cancellation
              </Text>
            </View>
          </View>

          {/* Action CTA */}
          <TouchableOpacity
            style={styles.bookCtaBtn}
            activeOpacity={0.85}
            onPress={() => setBookingModalVisible(true)}
          >
            <Text style={styles.bookCtaText}>Check Availability</Text>
            <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 7. Slide-up Booking Bottom Sheet */}
      <HotelBookingModal
        visible={bookingModalVisible}
        hotel={enrichedHotel}
        selectedRoom={currentRoom}
        onClose={() => setBookingModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF9F4",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#FCF9F4",
    justifyContent: "center",
    alignItems: "center",
  },
  propertyHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 6,
  },
  titleRatingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  propertyName: {
    flex: 1,
    fontSize: 23,
    fontFamily: FONTS.display.bold,
    color: "#4E051A",
    letterSpacing: -0.3,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: "#6B1D2F",
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  badgeMeta: {
    fontSize: 12,
    fontFamily: FONTS.body.semiBold,
    color: "#904D00",
  },
  metaDot: {
    color: "#DAC0C2",
  },
  locationMeta: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#544244",
  },
  editorialLead: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: "#544244",
    lineHeight: 19,
    marginTop: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(252, 249, 244, 0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(107, 29, 47, 0.08)",
    paddingTop: 12,
    paddingHorizontal: 16,
    ...SHADOWS.lg,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceAmount: {
    fontSize: 22,
    fontFamily: FONTS.display.bold,
    color: "#4E051A",
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#544244",
  },
  taxReassurance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  taxReassuranceText: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: "#904D00",
  },
  bookCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: "#4E051A",
    ...SHADOWS.md,
  },
  bookCtaText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
});
