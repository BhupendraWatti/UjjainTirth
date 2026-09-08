import ErrorState from "@/components/common/ErrorState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ScreenContainer from "@/components/layout/ScreenContainer";
import TransportCard from "@/components/transport/TransportCard";
import TransportCategoryFilter from "@/components/transport/TransportCategoryFilter";
import TransportEnquiryModal from "@/components/transport/TransportEnquiryModal";
import TransportHeader from "@/components/transport/TransportHeader";
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

  if (isLoading) {
    return (
      <ScreenContainer>
        <TransportHeader />
        <View style={styles.loadingWrapper}>
          <LoadingSkeleton />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !transportItems) {
    return (
      <ScreenContainer>
        <TransportHeader />
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
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
    fontWeight: "700",
    color: "#6B7280",
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
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
