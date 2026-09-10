import ErrorState from "@/components/common/ErrorState";
import Header from "@/components/home/Header";
import HeroBanner from "@/components/home/HeroBanner";
import RecommendationSection from "@/components/home/RecommendationSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import { useServices } from "@/hooks/useServices";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
export default function HomeScreen() {
  const { data: services, refetch, isLoading, isError } = useServices();

  const serviceImages = React.useMemo(() => {
    return (services || [])
      .map((s) => s.acf?.service_list_image || s.featured_image)
      .filter(Boolean);
  }, [services]);

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState onRetry={refetch} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <AvailabilityScreen
        isLoading={isLoading}
        count={services?.length || 0}
        label="Sacred Services Available"
        subtitle="Darshan, Aarti & Pilgrim Services"
        images={serviceImages}
        revealDurationMs={650}
      >
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
            paddingBottom: 12,
          }}
        />
      </AvailabilityScreen>
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
