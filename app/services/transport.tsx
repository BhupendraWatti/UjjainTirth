import ErrorState from "@/components/common/ErrorState";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import ScreenContainer from "@/components/layout/ScreenContainer";
import TransportCard from "@/components/transport/TransportCard";
import TransportCategoryFilter from "@/components/transport/TransportCategoryFilter";
import TransportEnquiryModal from "@/components/transport/TransportEnquiryModal";
import TransportHeader from "@/components/transport/TransportHeader";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { useTransportServices } from "@/hooks/useTransport";
import { TransportServiceItem } from "@/types/transport";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function TransportScreen() {
  const { data: transportItems, isLoading, isError, refetch } = useTransportServices();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<TransportServiceItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSelectCategory = useCallback((catId: string) => {
    setSelectedCategory(catId);
  }, []);

  const handleEnquire = useCallback((item: TransportServiceItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedItem(null);
  }, []);

  // Filter items based on selected category (derived state during render)
  const filteredItems = useMemo(() => {
    if (!transportItems || transportItems.length === 0) return [];
    if (selectedCategory === "all") return transportItems;

    return transportItems.filter((item) => {
      const cat = (item.service_category || "").toLowerCase();
      return cat.includes(selectedCategory.toLowerCase());
    });
  }, [transportItems, selectedCategory]);

  const transportImages = useMemo(() => {
    return (transportItems || [])
      .map((item) => item.image)
      .filter(Boolean);
  }, [transportItems]);

  if (isError && (!transportItems || transportItems.length === 0)) {
    return (
      <ScreenContainer>
        <TransportHeader />
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AvailabilityScreen
        isLoading={isLoading}
        count={transportItems?.length || 3}
        label="Vehicles Available"
        subtitle="Innova, Sedans & Tempo Travellers"
        images={transportImages}
        revealDurationMs={650}
      >
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TransportCard item={item} onEnquire={handleEnquire} />
          )}
          ListHeaderComponent={
            <>
              <TransportHeader />
              <TransportCategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />
              <View style={styles.countRow}>
                <Text style={styles.countText}>
                  Available Options ({filteredItems.length})
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No vehicles in this category</Text>
              <Text style={styles.emptySub}>
                Try selecting another category or view all vehicles
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
        />

        {/* Enquiry Modal */}
        <TransportEnquiryModal
          visible={modalVisible}
          item={selectedItem}
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
  listContent: {
    paddingBottom: 28,
  },
  countRow: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  countText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
  },
});
