import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import ErrorState from "@/components/common/ErrorState";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PoojaBookingModal from "@/components/pooja/PoojaBookingModal";
import PoojaCard from "@/components/pooja/PoojaCard";
import PoojaCategoryFilter from "@/components/pooja/PoojaCategoryFilter";
import PoojaFeaturedCard from "@/components/pooja/PoojaFeaturedCard";
import PoojaHeader from "@/components/pooja/PoojaHeader";
import { COLORS } from "@/constants/colors";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { usePoojas } from "@/hooks/usePooja";
import { PoojaItem } from "@/types/pooja";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  showBackButton?: boolean;
}

const PoojaScreenContent = ({ showBackButton = true }: Props) => {
  const { data: poojas, isLoading, isError, refetch } = usePoojas();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPooja, setSelectedPooja] = useState<PoojaItem | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSelectCategory = useCallback((catId: string) => {
    setSelectedCategory(catId);
  }, []);

  const handleRequestPooja = useCallback((item: PoojaItem) => {
    router.push({
      pathname: "/services/pooja-detail",
      params: { id: item.id.toString() },
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedPooja(null);
  }, []);

  const handleClearSearch = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSearchQuery("");
  }, []);

  // Compute live dynamic counts for categories
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      shiva: 0,
      special: 0,
      protection: 0,
      prosperity: 0,
    };

    if (!poojas || poojas.length === 0) return counts;

    counts.all = poojas.length;

    poojas.forEach((item) => {
      const cat = (item.category || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      const temple = (item.temple || "").toLowerCase();

      if (
        cat.includes("shiva") ||
        title.includes("rudra") ||
        temple.includes("mahakal")
      ) {
        counts.shiva += 1;
      }
      if (
        cat.includes("special") ||
        title.includes("mangal") ||
        title.includes("bhat") ||
        temple.includes("mangal")
      ) {
        counts.special += 1;
      }
      if (
        cat.includes("protection") ||
        title.includes("kaal") ||
        title.includes("bhairav") ||
        title.includes("sarp")
      ) {
        counts.protection += 1;
      }
      if (
        cat.includes("prosperity") ||
        cat.includes("devi") ||
        title.includes("archana")
      ) {
        counts.prosperity += 1;
      }
    });

    return counts;
  }, [poojas]);

  // Filter items based on selected category & search query
  const filteredPoojas = useMemo(() => {
    if (!poojas || poojas.length === 0) return [];

    let list = poojas;

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter((item) => {
        const cat = (item.category || "").toLowerCase();
        const title = (item.title || "").toLowerCase();
        const temple = (item.temple || "").toLowerCase();

        if (selectedCategory === "shiva") {
          return (
            cat.includes("shiva") ||
            title.includes("rudra") ||
            temple.includes("mahakal")
          );
        }
        if (selectedCategory === "special") {
          return (
            cat.includes("special") ||
            title.includes("mangal") ||
            title.includes("bhat") ||
            temple.includes("mangal")
          );
        }
        if (selectedCategory === "protection") {
          return (
            cat.includes("protection") ||
            title.includes("kaal") ||
            title.includes("bhairav") ||
            title.includes("sarp")
          );
        }
        if (selectedCategory === "prosperity") {
          return (
            cat.includes("prosperity") ||
            cat.includes("devi") ||
            title.includes("archana")
          );
        }
        return cat.includes(selectedCategory.toLowerCase());
      });
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q !== "") {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.temple.toLowerCase().includes(q) ||
          item.short_purpose.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q))
      );
    }

    return list;
  }, [poojas, selectedCategory, searchQuery]);

  // When "all" category is active and no search query, separate featured vs regular
  const isDefaultView = selectedCategory === "all" && searchQuery.trim() === "";

  const featuredPoojas = useMemo(() => {
    if (!isDefaultView || !poojas) return [];
    return poojas.filter((p) => p.is_featured);
  }, [isDefaultView, poojas]);

  const listItems = useMemo(() => {
    if (isDefaultView && featuredPoojas.length > 0) {
      return filteredPoojas.filter((p) => !p.is_featured);
    }
    return filteredPoojas;
  }, [isDefaultView, featuredPoojas, filteredPoojas]);

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
        subtitle="Rudrabhishek, Kaal Sarp & Mangal Poojas"
        images={poojaImages}
        revealDurationMs={650}
      >
        <FlatList
          data={listItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <PoojaCard
              item={item}
              index={index}
              onRequest={handleRequestPooja}
            />
          )}
          ListHeaderComponent={
            <>
              <PoojaHeader showBackButton={showBackButton} />

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Ionicons name="search" size={18} color={COLORS.inkMuted} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search ritual or temple (e.g. Mahakal)..."
                    placeholderTextColor={COLORS.inkFaint}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="never"
                  />
                  {searchQuery.length > 0 ? (
                    <TouchableOpacity
                      onPress={handleClearSearch}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={COLORS.inkMuted}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>

              {/* Dynamic Category Chips */}
              <PoojaCategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                counts={categoryCounts}
              />

              {/* Featured Section (when in All tab and no search active) */}
              {isDefaultView && featuredPoojas.length > 0 ? (
                <View style={styles.featuredSection}>
                  <View style={styles.sectionHeader}>
                    <Ionicons name="flame" size={16} color={COLORS.gold} />
                    <Text style={styles.sectionTitle}>
                      Featured Vedic Rituals
                    </Text>
                    <View style={styles.sectionBadge}>
                      <Text style={styles.sectionBadgeText}>
                        {featuredPoojas.length}
                      </Text>
                    </View>
                  </View>

                  {featuredPoojas.map((featItem, idx) => (
                    <PoojaFeaturedCard
                      key={`feat-${featItem.id}`}
                      item={featItem}
                      index={idx}
                      onRequest={handleRequestPooja}
                    />
                  ))}

                  <View style={styles.sectionDivider} />
                </View>
              ) : null}

              {/* Section Header for the List */}
              <View style={styles.countRow}>
                <Text style={styles.countText}>
                  {isDefaultView && featuredPoojas.length > 0
                    ? `Other Vedic Poojas (${listItems.length})`
                    : `Available Poojas (${filteredPoojas.length})`}
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={28} color={COLORS.inkMuted} />
              </View>
              <Text style={styles.emptyTitle}>No matching rituals found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search or select &ldquo;All Rituals&rdquo; to view all
                sacred poojas.
              </Text>
              {searchQuery !== "" ? (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleClearSearch}
                >
                  <Text style={styles.resetButtonText}>Clear Search</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={5}
        />

        {/* Dynamic Booking Action Modal */}
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
  listContent: {
    paddingBottom: 36,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.body.regular,
    color: COLORS.ink,
    paddingVertical: 0,
  },
  featuredSection: {
    marginBottom: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
  sectionBadge: {
    backgroundColor: "rgba(184, 128, 46, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 2,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.hairline,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  countRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  countText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 6,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: COLORS.sacredTint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "rgba(124, 31, 43, 0.2)",
  },
  resetButtonText: {
    fontSize: 13,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
});
