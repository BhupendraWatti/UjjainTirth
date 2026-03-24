import React from "react";
import { FlatList } from "react-native";

import ErrorState from "@/components/common/ErrorState";
import Header from "@/components/home/Header";
import HeroBanner from "@/components/home/HeroBanner";
import RecommendationSection from "@/components/home/RecommendationSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { useServices } from "@/hooks/useServices";

export default function HomeScreen() {
  const { data, refetch, isLoading, isError } = useServices();

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
        data={[{}]} // dummy data
        keyExtractor={() => "home"}
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
