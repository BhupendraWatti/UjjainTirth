import CollapsibleSection from "@/components/temples/CollapsibleSection";
import MapCard from "@/components/temples/MapCard";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { useTempleDistances, formatDistance } from "@/hooks/useTempleDistances";
import { usePoojas } from "@/hooks/usePooja";
import { fetchTempleBySlug } from "@/services/templeService";
import { Temple } from "@/types/temple";
import { router } from "expo-router";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

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

  // ── Distance tracking for this single temple ──
  const templesArray = useMemo(
    () => (temple ? [temple] : []),
    [temple]
  );
  const { distances, locationStatus } = useTempleDistances(templesArray);
  const distanceKm = temple ? distances[temple.id] ?? null : null;

  const { data: allPoojas } = usePoojas();
  const relatedPoojas = useMemo(() => {
    if (!allPoojas || !temple) return [];
    const tTitle = (temple.title || "").toLowerCase();
    const tSlug = (slug || "").toLowerCase();
    return allPoojas.filter((p) => {
      const pTemple = (p.temple || "").toLowerCase();
      const pTitle = (p.title || "").toLowerCase();
      if (tTitle.includes("mahakal") || tSlug.includes("mahakal")) {
        return pTemple.includes("mahakal") || pTitle.includes("rudra") || pTitle.includes("sarp");
      }
      if (tTitle.includes("mangal") || tSlug.includes("mangal")) {
        return pTemple.includes("mangal") || pTitle.includes("mangal") || pTitle.includes("bhat");
      }
      return pTemple.includes(tTitle) || tTitle.includes(pTemple);
    });
  }, [allPoojas, temple, slug]);

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
      <View style={{ flex: 1, marginTop: 2, backgroundColor: "#F5F2EA" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
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
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {temple.acf?.temple_tag?.name || "Temple"}
                  </Text>
                </View>

                {/* Distance badge on header */}
                {distanceKm !== null && (
                  <View style={styles.distanceBadge}>
                    <Text style={styles.distanceBadgeText}>
                      📍 {formatDistance(distanceKm)}
                    </Text>
                  </View>
                )}
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

          {/* SACRED POOJAS AT THIS TEMPLE */}
          {relatedPoojas.length > 0 && (
            <View style={styles.section}>
              <View style={styles.poojaHeaderRow}>
                <Ionicons name="flame" size={18} color={COLORS.gold} />
                <Text style={styles.sectionTitle}>Sacred Poojas at this Temple</Text>
              </View>

              {relatedPoojas.map((pItem) => (
                <TouchableOpacity
                  key={`temple-pooja-${pItem.id}`}
                  style={styles.templePoojaCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/services/pooja-detail",
                      params: { id: pItem.id.toString() },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`View ritual: ${pItem.title}`}
                >
                  <View style={styles.templePoojaLeft}>
                    <Text style={styles.templePoojaTitle}>{pItem.title}</Text>
                    <Text style={styles.templePoojaDuration}>⏱ {pItem.duration}</Text>
                    <Text style={styles.templePoojaPrice}>
                      Dakshina: {pItem.starting_price ? `₹${pItem.starting_price.toLocaleString("en-IN")}` : "As per Vidhi"}
                    </Text>
                  </View>
                  <View style={styles.templePoojaBtn}>
                    <Text style={styles.templePoojaBtnText}>View Vidhi</Text>
                    <Ionicons name="chevron-forward" size={13} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* LOCATION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>

            <MapCard
              latitude={Number(temple.acf?.latitude)}
              longitude={Number(temple.acf?.longitude)}
              mapUrl={temple.acf?.map_url}
              distanceKm={distanceKm}
              title={temple.title}
              address="Ujjain, Madhya Pradesh"
              onPress={openMap}
            />
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* CTA BUTTON */}
        <TouchableOpacity style={styles.cta}>
          <Text
            onPress={() => router.push("/coming-soon")}
            style={styles.ctaText}
          >
            Book My Darshan
          </Text>
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
    height: "130%",
    objectFit: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    position: "absolute",
    bottom: 20,
    left: 16,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },
  distanceBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  distanceBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: FONTS.body.bold,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontFamily: FONTS.display.semiBold,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 8,
  },
  description: {
    color: COLORS.inkBody,
    fontFamily: FONTS.body.regular,
    lineHeight: 22,
    fontSize: 14,
  },
  poojaHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  templePoojaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },
  templePoojaLeft: {
    flex: 1,
    marginRight: 10,
  },
  templePoojaTitle: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.ink,
    marginBottom: 3,
  },
  templePoojaDuration: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginBottom: 2,
  },
  templePoojaPrice: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.sacred,
  },
  templePoojaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.sacred,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
  },
  templePoojaBtnText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
  },
  cta: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: "center",
    ...SHADOWS.elevated,
  },
  ctaText: {
    color: "#FFFFFF",
    fontFamily: FONTS.body.bold,
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
