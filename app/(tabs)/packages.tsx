import ScreenContainer from "@/components/layout/ScreenContainer";
import PackageCard from "@/components/packages/PackageCards";
import PackageDetailModal from "@/components/packages/PackageDetailModal";
import PackageLoadingSkeleton from "@/components/packages/PackageLoadingSkeleton";
import TabSwitcher from "@/components/packages/TabSwitcher";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
// import ComingSoon from "@/components/ui/ComingSoon";
import { COLORS } from "@/constants/colors";
import { usePackages } from "@/hooks/useProducts";
import { Package } from "@/types/product";
import { PackageTab } from "@/types/tab";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PackagesScreen() {
  // Default tab is "custom" (My Package/My Cost) as requested
  const [activeTab, setActiveTab] = useState<PackageTab>("custom");
  const { packages, loading, error, reload } = usePackages();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handlePackagePress = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDetailVisible(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const renderListContent = () => {
    if (loading && !refreshing) {
      return <PackageLoadingSkeleton />;
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <ErrorState onRetry={reload} />
        </View>
      );
    }

    if (!packages || packages.length === 0) {
      return (
        <View style={styles.stateContainer}>
          <EmptyState message="No packages available yet" />
        </View>
      );
    }

    return (
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 8,
        }}
        renderItem={({ item }) => (
          <PackageCard
            item={item}
            onPress={() => handlePackagePress(item)}
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
    );
  };

  return (
    <ScreenContainer noPadding>
      {/* TABS - No header title/subtitle as requested */}
      <View style={styles.tabContainer}>
        <TabSwitcher
          tabs={[
            { label: "My Package / My Cost", value: "custom" },
            { label: "Latest Packages", value: "list" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        />
      </View>

      {/* CONTENT */}
      {activeTab === "custom" ? (
        // === "My Package / My Cost" Tab (Form tab) ===
        // Coming Soon code commented as requested - do not remove
        // <View style={{ flex: 1 }}>
        //   <ComingSoon
        //     title="Coming Soon"
        //     subtitle="Personalized Packages Coming Soon"
        //   />
        // </View>
        <View style={{ flex: 1 }}>
          <View style={styles.customFormContainer}>
            <Text style={styles.customFormIcon}>✨</Text>
            <Text style={styles.customFormTitle}>
              Build Your Own Package
            </Text>
            <Text style={styles.customFormSubtitle}>
              Create a personalized spiritual journey tailored to your preferences and budget
            </Text>
            <View style={styles.customFormDivider} />
            <Text style={styles.customFormNote}>
              🚀 Custom package builder coming soon!
            </Text>
          </View>
        </View>
      ) : (
        // === "Latest Packages" Tab ===
        // Coming Soon code commented as requested - do not remove
        // <View style={{ flex: 1 }}>
        //   <ComingSoon
        //     title="Coming Soon"
        //     subtitle="Curated Spiritual Packages Coming Soon"
        //   />
        // </View>
        <View style={{ flex: 1 }}>{renderListContent()}</View>
      )}

      {/* Package Detail Modal */}
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
    marginTop: 8,
    marginBottom: 4,
  },

  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Custom form placeholder styles
  customFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  customFormIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  customFormTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
    marginBottom: 10,
  },

  customFormSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },

  customFormDivider: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: 20,
  },

  customFormNote: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
