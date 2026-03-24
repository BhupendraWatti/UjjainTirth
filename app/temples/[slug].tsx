import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CollapsibleSection from "@/components/temples/CollapsibleSection";
import MapCard from "@/components/temples/MapCard";
// import CollapsibleSection from "../../../components/temples/CollapsibleSection";
// import MapCard from "@/components/temples/MapCard";
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
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EB5C49" />
      </View>
    );
  }

  if (error || !temple) {
    return (
      <View style={styles.center}>
        <Text>{error || "No Data"}</Text>
      </View>
    );
  }

  const openMap = () => {
    if (temple.acf?.map_url) {
      Linking.openURL(temple.acf.map_url);
    }
  };
  console.log("RECEIVED SLUG:", slug);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={{ uri: temple.image }} style={styles.headerImage} />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.overlay}
          />

          <View style={styles.headerContent}>
            {temple.acf?.temple_tag?.name && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {temple.acf.temple_tag.name}
                </Text>
              </View>
            )}

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
        {temple.acf.aarti_periods?.length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aarti Schedule</Text>

            {temple.acf.aarti_periods.map((period, index) => (
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

          <MapCard mapUrl={temple.acf?.map_url} onPress={openMap} />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* CTA BUTTON */}
      <TouchableOpacity style={styles.cta}>
        <Text style={styles.ctaText}>Book My Darshan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TempleDetailScreen;

const styles = StyleSheet.create({
  header: {
    height: 260,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
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
