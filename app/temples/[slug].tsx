import CollapsibleSection from "@/components/temples/CollapsibleSection";
import MapCard from "@/components/temples/MapCard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import CollapsibleSection from "../../../components/temples/CollapsibleSection";
// import MapCard from "@/components/temples/MapCard";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { fetchTempleBySlug } from "@/services/templeService";
import { Temple } from "@/types/temple";
// import MapCard from "../../../components/temples/MapCard";
const TempleDetailScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTemple = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTempleBySlug(slug);
      if (!data) {
        setError("Temple not found");
      } else {
        setTemple(data);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) loadTemple();
  }, [slug]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !temple) {
    return (
      <View style={styles.center}>
        <Text>{error || "No Data"}</Text>
      </View>
    );
  }
  const aarti = Array.isArray(temple?.acf?.aarti_periods)
    ? temple.acf.aarti_periods
    : [];
  const openMap = () => {
    if (temple.acf?.map_url) {
      Linking.openURL(temple.acf.map_url);
    }
  };

  return (
    <>
      {/* <ScreenContainer /> */}
      <View style={{ flex: 1, marginTop: 2, backgroundColor: "#F5F2EA" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Image source={{ uri: temple.image }} style={styles.headerImage} />

            {/* Stronger gradient */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.85)"]}
              style={styles.overlay}
            />

            <View style={styles.headerContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {temple.acf?.temple_tag?.name || "Temple"}
                </Text>
              </View>

              <Text style={styles.title}>{temple.title}</Text>
            </View>
          </View>

          {/* ABOUT */}
          {temple.acf?.temple_short_description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About the Temple</Text>
              <Text style={styles.description}>
                {temple.acf.temple_short_description}
              </Text>
            </View>
          )}

          {/* AARTI */}
          {aarti.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule</Text>

              {aarti.map((period, index) => (
                <CollapsibleSection
                  key={index}
                  title={period.period_title}
                  items={period.aarti_list}
                />
              ))}
            </View>
          ) : null}

          {/* LOCATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <MapCard
              latitude={Number(temple.acf?.latitude)}
              longitude={Number(temple.acf?.longitude)}
              mapUrl={temple.acf?.map_url}
              title={temple.title}
              address="Ujjain, Madhya Pradesh"
              onPress={openMap}
            />
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* CTA BUTTON */}
        <TouchableOpacity style={styles.cta}>
          <Text style={styles.ctaText}>Book My Darshan</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default TempleDetailScreen;

const styles = StyleSheet.create({
  header: {
    height: 280,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 16,
  },
  badge: {
    backgroundColor: "#EB5C49",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    color: "#444",
    lineHeight: 22,
  },
  cta: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#EB5C49",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
