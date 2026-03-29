import PackageCard from "@/components/packages/PackageCards";
import TabSwitcher from "@/components/packages/TabSwitcher";
import { COLORS } from "@/constants/colors";
import { usePackages } from "@/hooks/useProducts";
import { PackageTab } from "@/types/tab";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export default function PackagesScreen() {
  const [activeTab, setActiveTab] = useState<PackageTab>("list");
  const { packages } = usePackages();
  const router = useRouter();
  type TabValue = "custom" | "list";

  interface Tab {
    label: string;
    value: TabValue;
  }

  interface Props {
    tabs: Tab[];
    active: TabValue;
    onChange: (val: TabValue) => void;
  }
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>Travel Packages</Text>
        <Text style={styles.subHeading}>Customize your spiritual journey</Text>
      </View>

      {/* TABS */}
      {/* <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "custom" && styles.activeTab]}
          onPress={() => setActiveTab("custom")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "custom" && styles.activeTabText,
            ]}
          >
            My Package
          </Text>
          <Text style={styles.tabSub}>Customize</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.activeTab]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.activeTabText,
            ]}
          >
            Latest Packages
          </Text>
          <Text style={styles.tabSub}>Browse All</Text>
        </TouchableOpacity>
      </View> */}
      <TabSwitcher
        tabs={[
          { label: "My Package", value: "custom" },
          { label: "Latest Packages", value: "list" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />
      {/* CONTENT */}
      {activeTab === "custom" ? (
        <TouchableOpacity
          style={styles.customCard}
          onPress={() => router.push("/packages/form")}
        >
          <Text style={styles.customTitle}>Customize Your Package</Text>
          <Text style={styles.customDesc}>
            Tap to fill details and create your own journey
          </Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <PackageCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/packages/detail",
                  params: {
                    data: JSON.stringify(item),
                  },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },

  header: {
    marginBottom: 16,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  subHeading: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  activeTabText: {
    color: "#fff",
  },

  tabSub: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },

  customCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
  },

  customTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  customDesc: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textLight,
  },
});
