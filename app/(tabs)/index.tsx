import ErrorState from "@/components/common/ErrorState";
import Header from "@/components/home/Header";
import HeroBanner from "@/components/home/HeroBanner";
import RecommendationSection from "@/components/home/RecommendationSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import HomePoojaSection from "@/components/home/HomePoojaSection";
import ScreenContainer from "@/components/layout/ScreenContainer";
import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import { useServices } from "@/hooks/useServices";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
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
    <ScreenContainer noPadding>
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
                <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.3}>
                  Our Services
                </Text>
              </View>

              <ServicesGrid services={services || []} />
              <HomePoojaSection />
              <RecommendationSection />
            </>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 110,
          }}
        />
      </AvailabilityScreen>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: -0.2,
  },
});
