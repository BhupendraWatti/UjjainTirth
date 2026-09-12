import { AvailabilityScreen } from "@/components/common/AvailabilityLoader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ScreenContainer from "@/components/layout/ScreenContainer";
import PackageCard from "@/components/packages/PackageCards";
import PackageDetailModal from "@/components/packages/PackageDetailModal";
import TabSwitcher from "@/components/packages/TabSwitcher";
import { APP_CONFIG } from "@/constants/appConfig";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { usePackages } from "@/hooks/useProducts";
import { Package } from "@/types/product";
import { PackageTab } from "@/types/tab";
import * as Linking from "expo-linking";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

export default function PackagesScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numColumns = isTablet ? 2 : 1;
  const cardWidth = isTablet ? (width - 44) / 2 : "100%";

  // Default tab set to "list" (Latest Packages) so curated Sacred Journey cards appear immediately
  const [activeTab, setActiveTab] = useState<PackageTab>("list");
  const { packages, loading, error, reload } = usePackages();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // View Details action: opens the package detail modal
  const handlePackagePress = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDetailVisible(true);
  };

  // Booking action on circular CTA: initiates direct booking inquiry call
  const handleBookingPress = async (pkg: Package) => {
    const telUrl = Platform.select({
      ios: `telprompt:${APP_CONFIG.SUPPORT_PHONE}`,
      android: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
      default: `tel:${APP_CONFIG.SUPPORT_PHONE}`,
    });
    try {
      if (await Linking.canOpenURL(telUrl)) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert(
          "Book Package",
          `To book "${pkg.name}", please contact our support team at ${APP_CONFIG.SUPPORT_PHONE}.`
        );
      }
    } catch {
      Alert.alert(
        "Book Package",
        `To book "${pkg.name}", please contact our support team at ${APP_CONFIG.SUPPORT_PHONE}.`
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const renderEditorialHeader = () => (
    <View style={styles.editorialHeaderContainer}>
      <View style={styles.editorialHeaderRow}>
        <Text style={styles.editorialTitle}>Sacred Journeys</Text>
        <View style={styles.headerFlourish}>
          <Svg width={36} height={12} viewBox="0 0 36 12" fill="none">
            <Line x1="0" y1="6" x2="12" y2="6" stroke="#C99A55" strokeWidth="1" strokeDasharray="2 2" />
            <Path d="M 18 1 C 16 4 16 8 18 11 C 20 8 20 4 18 1 Z" fill="#C99A55" />
            <Circle cx="18" cy="6" r="1.5" fill="#FAF4EA" />
            <Line x1="24" y1="6" x2="36" y2="6" stroke="#C99A55" strokeWidth="1" strokeDasharray="2 2" />
          </Svg>
        </View>
      </View>
      <Text style={styles.editorialSubtitle}>
        Curated Pilgrimages &amp; Temple Yatras in Ujjain
      </Text>
    </View>
  );

  const packageImages = useMemo(() => {
    return (packages || [])
      .map((p) => p.image?.trim())
      .filter((img): img is string => Boolean(img && img.length > 0));
  }, [packages]);

  const renderListContent = () => {
    if (error) {
      return (
        <View style={styles.stateContainer}>
          <ErrorState onRetry={reload} />
        </View>
      );
    }

    if (!loading && (!packages || packages.length === 0)) {
      return (
        <View style={styles.stateContainer}>
          <EmptyState message="No sacred packages currently listed" />
        </View>
      );
    }

    return (
      <AvailabilityScreen
        isLoading={loading && !refreshing}
        count={packages?.length || 0}
        label="Yatra Packages Available"
        subtitle="Curated 2-3 Day Spiritual Tours"
        images={packageImages}
        revealDurationMs={700}
      >
        <FlatList
          key={numColumns} // Re-bind on column change to prevent runtime error
          data={packages}
          numColumns={numColumns}
          columnWrapperStyle={isTablet ? styles.tabletRow : null}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderEditorialHeader}
          contentContainerStyle={{
            paddingBottom: 32,
            paddingTop: 4,
          }}
          renderItem={({ item, index }) => (
            <PackageCard
              item={item}
              index={index}
              onPress={() => handlePackagePress(item)}
              onBook={() => handleBookingPress(item)}
              style={isTablet ? { width: cardWidth, marginHorizontal: 0 } : undefined}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        />
      </AvailabilityScreen>
    );
  };

  return (
    <ScreenContainer noPadding>
      {/* ============================================================ */}
      {/* SWIGGY / ZOMATO STYLE UNIQUE TAB SWITCHER                    */}
      {/* ============================================================ */}
      <View style={styles.tabContainer}>
        <TabSwitcher
          tabs={[
            { label: "Latest Packages", value: "list", badge: "Curated" },
            { label: "My Package / My Cost", value: "custom", badge: "Builder" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* ============================================================ */}
      {/* TAB CONTENT                                                  */}
      {/* ============================================================ */}
      {activeTab === "custom" ? (
        // === "My Package / My Cost" Tab (Form tab) ===
        <View style={{ flex: 1 }}>
          <View style={styles.customFormContainer}>
            <View style={styles.customFormIconWrapper}>
              <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
                <Circle cx={20} cy={20} r={18} stroke="#C99A55" strokeWidth={1} strokeDasharray="3 3" />
                <Path d="M 20 8 L 22 17 L 31 20 L 22 23 L 20 32 L 18 23 L 9 20 L 18 17 Z" fill="#C99A55" />
              </Svg>
            </View>
            <Text style={styles.customFormTitle}>Build Your Own Package</Text>
            <Text style={styles.customFormSubtitle}>
              Create a personalized spiritual journey tailored to your preferences, ghats, and budget.
            </Text>
            <View style={styles.customFormDivider} />
            <Text style={styles.customFormNote}>
              Custom package builder coming soon!
            </Text>
          </View>
        </View>
      ) : (
        // === "Latest Packages" Tab (Sacred Journey Package Cards) ===
        <View style={{ flex: 1 }}>{renderListContent()}</View>
      )}

      {/* ============================================================ */}
      {/* PACKAGE DETAIL MODAL                                         */}
      {/* ============================================================ */}
      <PackageDetailModal
        visible={detailVisible}
        item={selectedPackage}
        onClose={() => {
          setDetailVisible(false);
          setSelectedPackage(null);
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    marginTop: 6,
    marginBottom: 2,
  },

  tabletRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 0,
  },

  editorialHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
  },

  editorialHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  editorialTitle: {
    fontSize: 21,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    letterSpacing: 0.2,
  },

  headerFlourish: {
    alignItems: "center",
    justifyContent: "center",
  },

  editorialSubtitle: {
    fontSize: 12.5,
    fontFamily: FONTS.body.medium,
    color: COLORS.inkMuted,
    marginTop: 2,
    letterSpacing: 0.1,
  },

  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },

  // Custom form placeholder styles
  customFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  customFormIconWrapper: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  customFormTitle: {
    fontSize: 22,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    textAlign: "center",
    marginBottom: 10,
  },

  customFormSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },

  customFormDivider: {
    width: 44,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 20,
  },

  customFormNote: {
    fontSize: 14,
    fontFamily: FONTS.body.bold,
    color: COLORS.primary,
  },
});
