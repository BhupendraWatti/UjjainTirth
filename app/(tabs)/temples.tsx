import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ScreenContainer from "@/components/layout/ScreenContainer";
import CategoryFilter from "@/components/temples/CategoryFilter";
import TempleCard from "@/components/temples/TempleCard";
import TempleSearch from "@/components/temples/TempleSearch";

import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import { useTemples } from "@/hooks/useTemples";

export default function TemplesScreen() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<number | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    isError,
  } = useTemples({
    tag: selectedTag,
  });
  // const { data: tags } = useTempleTags();

  const temples = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const categories = useMemo(() => {
    const map = new Map();

    temples.forEach((temple) => {
      const tag = temple.acf?.temple_tag;

      if (tag && !map.has(tag.id)) {
        map.set(tag.id, {
          id: tag.id,
          name: tag.name,
        });
      }
    });

    return Array.from(map.values());
  }, [temples]);

  const filteredData = useMemo(() => {
    let result = temples;

    // 🔍 Search filter
    if (search.trim()) {
      result = result.filter((temple) =>
        temple.title?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 🏷 Tag filter
    if (selectedTag) {
      result = result.filter(
        (temple) => temple.acf?.temple_tag?.id === selectedTag,
      );
    }

    return result;
  }, [temples, selectedTag, search]);

  // console.log("CATEGORIES:", categories);

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingSkeleton />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TempleCard temple={item} />}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Temples in Ujjain</Text>

            <TempleSearch onSearch={setSearch} />

            <CategoryFilter
              categories={categories}
              selected={selectedTag}
              onSelect={setSelectedTag}
            />

            {selectedTag && (
              <View style={styles.filterBox}>
                <View>
                  <Text style={styles.filterInfo}>
                    Showing results for selected category
                  </Text>
                  <Text style={styles.resultCount}>
                    {filteredData.length} places found
                  </Text>
                </View>

                <Text
                  style={styles.clearFilter}
                  onPress={() => setSelectedTag(null)}
                >
                  Clear ✕
                </Text>
              </View>
            )}
          </>
        }
        contentContainerStyle={{
          paddingBottom: 60,
          flexGrow: 1, // 🔥 critical
        }}
        ListEmptyComponent={
          <EmptyState
            message={
              search
                ? `No temples found for "${search}"`
                : selectedTag
                  ? "No temples found for this category"
                  : "No temples available"
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#8B0000",
    marginBottom: 10,
  },

  list: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  resultCount: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  filterInfo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  clearFilter: {
    color: "#EB5C49",
    fontSize: 13,
    marginBottom: 10,
    fontWeight: "500",
  },
  filterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  filterPlaceholder: {
    height: 0, // 🔥 same height as filterBox
  },
  filterContainer: {
    marginTop: 4,
    marginBottom: 12,
  },
});
