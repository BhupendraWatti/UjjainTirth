import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';

import ScreenContainer from '@/components/layout/ScreenContainer';
import TempleCard from '@/components/temples/TempleCard';
import TempleSearch from '@/components/temples/TempleSearch';
import CategoryFilter from '@/components/temples/CategoryFilter';
import LoadingSkeleton from '@/components/temples/LoadingSkeleton';

import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';

import { useTemples } from '@/hooks/useTemples';
import { useTempleTags } from '@/hooks/useTempleTags';

export default function TemplesScreen() {
  const [search, setSearch] = useState('');
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
    search,
    tag: selectedTag,
  });

  const { data: tags } = useTempleTags();

const temples = useMemo(() => {
  if (!data) return [];
  return data.pages.flatMap(page => page.data);
}, [data]);

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
      <Text style={styles.title}>Temples in Ujjain</Text>

      <TempleSearch onSearch={setSearch} />

      <CategoryFilter
        categories={tags || []}
        selected={selectedTag}
        onSelect={setSelectedTag}
      />

      <FlatList
        data={temples}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TempleCard temple={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        ListEmptyComponent={<EmptyState message="No temples found" />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#8B0000',
    marginBottom: 10,
  },

  list: {
    paddingTop: 10,
    paddingBottom: 40,
  },
});