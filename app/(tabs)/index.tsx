import ErrorState from "@/components/common/ErrorState";
import Header from "@/components/home/Header";
import HeroBanner from "@/components/home/HeroBanner";
import RecommendationSection from "@/components/home/RecommendationSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { useServices } from "@/hooks/useServices";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { FlatList } from "react-native";
export default function HomeScreen() {
  const { data: services, refetch, isLoading, isError } = useServices();
  // const services: Service[] = [];
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
        data={[]} // 👈 EMPTY (important)
        renderItem={null}
        ListHeaderComponent={
          <>
            <Header />
            <HeroBanner />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Our Services</Text>
            </View>

            <ServicesGrid services={services || []} />
            <RecommendationSection />
          </>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      />
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3A3A",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
});
