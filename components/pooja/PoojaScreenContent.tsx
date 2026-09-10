import ErrorState from "@/components/common/ErrorState";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import PoojaBookingModal from "@/components/pooja/PoojaBookingModal";
import PoojaCard from "@/components/pooja/PoojaCard";
import PoojaCategoryFilter from "@/components/pooja/PoojaCategoryFilter";
import PoojaHeader from "@/components/pooja/PoojaHeader";
import { usePoojas } from "@/hooks/usePooja";
import { PoojaItem } from "@/types/pooja";
import React, { memo, useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Props {
  showBackButton?: boolean;
}

const PoojaScreenContent = ({ showBackButton = true }: Props) => {
  const { data: poojas, isLoading, isError, refetch } = usePoojas();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPooja, setSelectedPooja] = useState<PoojaItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSelectCategory = useCallback((catId: string) => {
    setSelectedCategory(catId);
  }, []);

  const handleRequestPooja = useCallback((item: PoojaItem) => {
    setSelectedPooja(item);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedPooja(null);
  }, []);

  // Filter items based on selected category (derived state during render)
  const filteredPoojas = useMemo(() => {
    if (!poojas || poojas.length === 0) return [];
    if (selectedCategory === "all") return poojas;

    return poojas.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const temple = (item.temple || "").toLowerCase();

      if (selectedCategory === "shiva") {
        return cat.includes("shiva") || title.includes("rudra") || temple.includes("mahakal");
      }
      if (selectedCategory === "special") {
        return cat.includes("special") || title.includes("mangal") || title.includes("bhat") || temple.includes("mangal");
      }
      if (selectedCategory === "protection") {
        return cat.includes("protection") || title.includes("kaal") || title.includes("bhairav") || title.includes("sarp");
      }
      if (selectedCategory === "prosperity") {
        return cat.includes("prosperity") || cat.includes("devi") || title.includes("archana");
      }
      return cat.includes(selectedCategory.toLowerCase());
    });
  }, [poojas, selectedCategory]);

  const poojaImages = useMemo(() => {
    return (poojas || []).map((p) => p.image).filter(Boolean);
  }, [poojas]);

  if (isError || (!isLoading && !poojas)) {
    return (
      <ScreenContainer>
        <PoojaHeader showBackButton={showBackButton} />
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AvailabilityScreen
        isLoading={isLoading}
        count={poojas?.length || 0}
        label="Vedic Rituals Available"
        subtitle="Rudrabhishek, Kaal Sarp & Shanti Poojas"
        images={poojaImages}
        revealDurationMs={650}
      >
        <FlatList
        data={filteredPoojas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PoojaCard item={item} onRequest={handleRequestPooja} />
        )}
        ListHeaderComponent={
          <>
            <PoojaHeader showBackButton={showBackButton} />
            <PoojaCategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
            <View style={styles.countRow}>
              <Text style={styles.countText}>
                Vedic Rituals Available ({filteredPoojas.length})
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No poojas found in this category</Text>
            <Text style={styles.emptySub}>
              Please select another category to view all Vedic rituals
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />

        {/* Booking Modal */}
        <PoojaBookingModal
          visible={modalVisible}
          item={selectedPooja}
          onClose={handleCloseModal}
        />
      </AvailabilityScreen>
    </ScreenContainer>
  );
};

export default memo(PoojaScreenContent);

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
