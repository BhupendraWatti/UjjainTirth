import React from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';

import ScreenContainer from '@/components/layout/ScreenContainer';
import Header from '@/components/home/Header';
import HeroBanner from '@/components/home/HeroBanner';
import ServicesGrid from '@/components/home/ServicesGrid';
import RecommendationSection from '@/components/home/RecommendationSection';
import { useServices } from '@/hooks/useServices';
import LoadingSkeleton from '@/components/temples/LoadingSkeleton';
import ErrorState from '@/components/common/ErrorState';

export default function HomeScreen() {

  const {
    data,
    refetch,
    isLoading,
    isError,
  } = useServices();

  if(isLoading){
    return( 
    <ScreenContainer>
        <LoadingSkeleton/>
    </ScreenContainer>
  )}

  if(isError){
    return (
      <ScreenContainer>
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }


  return (
    <ScreenContainer>
      <FlatList
        data={[{}]} // dummy data
        keyExtractor={() => 'home'}
        renderItem={() => (
          <>
            <Header />
            <HeroBanner />
            <ServicesGrid />
            <RecommendationSection />
          </>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}