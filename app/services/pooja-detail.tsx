import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import ScreenContainer from "@/components/layout/ScreenContainer";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import PoojaBookingModal from "@/components/pooja/PoojaBookingModal";
import {
  PoojaBottomBar,
  PoojaHero,
  PoojaOverviewTab,
  PoojaPackagesTab,
  PoojaQuickMeta,
  PoojaTabBar,
} from "@/components/pooja/detail";
import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { RADIUS } from "@/constants/theme";
import { FONTS } from "@/constants/typography";
import { usePoojaById, usePoojas } from "@/hooks/usePooja";
import { PoojaDakshinaTier } from "@/types/pooja";
import { PoojaWorkflowTab } from "@/components/pooja/detail/PoojaWorkflowTab";

export default function PoojaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: poojaDirect, isLoading: isLoadingDirect } = usePoojaById(id);
  const { data: poojas, isLoading: isLoadingPoojas } = usePoojas();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<PoojaDakshinaTier | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState<boolean>(false);

  const pooja = useMemo(() => {
    if (poojaDirect) return poojaDirect;
    if (!poojas || !id) return null;
    return poojas.find((p) => p.id === Number(id)) || null;
  }, [poojaDirect, poojas, id]);

  const isLoading = (isLoadingDirect || isLoadingPoojas) && !pooja;

  // Initialize selected tier to first available package once loaded
  useEffect(() => {
    if (pooja?.dakshina_tiers && pooja.dakshina_tiers.length > 0 && !selectedTier) {
      setSelectedTier(pooja.dakshina_tiers[0]);
    }
  }, [pooja, selectedTier]);

  const activePrice = useMemo(() => {
    if (selectedTier && selectedTier.price !== null) {
      return selectedTier.price;
    }
    return pooja?.starting_price ?? null;
  }, [selectedTier, pooja]);

  const handleSelectTier = useCallback((tier: PoojaDakshinaTier) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setSelectedTier(tier);
  }, []);

  const handleBack = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/puja");
    }
  }, []);

  const handleShare = useCallback(() => {
    if (!pooja) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const dakshinaStr = activePrice
      ? `₹${activePrice.toLocaleString("en-IN")}`
      : "As per Vidhi";
    Share.share({
      title: `${pooja.title} - UjjainTirth`,
      message: `🙏 ${pooja.title}\n📍 Temple: ${pooja.temple}\n⏱ Duration: ${pooja.duration}\n💰 Dakshina: ${dakshinaStr}\n\nBook your sacred Vedic ritual at Ujjain: https://ujjaintirth.com/pooja`,
    }).catch((err) => console.log("Share error:", err));
  }, [pooja, activePrice]);

  const handleCall = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const phone = APP_CONFIG.SUPPORT_PHONE || "+919179187199";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (Platform.OS !== "web") {
      import("react-native").then(({ Linking }) => {
        Linking.openURL(`tel:${cleanPhone}`).catch((err) =>
          console.warn("Could not make call:", err)
        );
      });
    } else {
      window.open(`tel:${cleanPhone}`);
    }
  }, []);

  const handleOpenBookingModal = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setBookingModalVisible(true);
  }, []);

  const handleCloseBookingModal = useCallback(() => {
    setBookingModalVisible(false);
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <LoadingSkeleton />
      </ScreenContainer>
    );
  }

  if (!pooja) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorTitle}>Ritual Not Found</Text>
          <Text style={styles.errorSub}>
            The requested Vedic ritual could not be loaded.
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backBtnText}>Return to Poojas</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.screenWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Full-bleed Hero Section */}
          <PoojaHero item={pooja} onBack={handleBack} onShare={handleShare} />

          {/* Main Body Content with 3-Tab Architecture */}
          <View style={styles.contentContainer}>
            {/* Quick Metadata: Duration, Muhurat, Dham */}
            <PoojaQuickMeta item={pooja} />

            {/* Segmented 3-Tab Bar Switcher */}
            <PoojaTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

            {/* Active Tab Content */}
            {activeTab === 0 && <PoojaOverviewTab item={pooja} />}
            {activeTab === 1 && <PoojaWorkflowTab item={pooja} />}
            {activeTab === 2 && (
              <PoojaPackagesTab
                item={pooja}
                selectedTier={selectedTier}
                onSelectTier={handleSelectTier}
              />
            )}

            <View style={{ height: 32 }} />
          </View>
        </ScrollView>

        {/* Sticky Bottom Dakshina & Booking Bar */}
        <PoojaBottomBar
          activePrice={activePrice}
          selectedTier={selectedTier}
          onCall={handleCall}
          onBook={handleOpenBookingModal}
        />

        {/* Interactive Booking Modal */}
        <PoojaBookingModal
          visible={bookingModalVisible}
          item={pooja}
          onClose={handleCloseBookingModal}
          selectedTier={selectedTier}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginTop: -16,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    backgroundColor: COLORS.bg,
    paddingTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginTop: 12,
    marginBottom: 4,
  },
  errorSub: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: COLORS.sacred,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: FONTS.body.bold,
  },
});
