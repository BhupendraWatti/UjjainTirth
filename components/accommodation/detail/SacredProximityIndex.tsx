import { EnrichedHotel, hasProximityData } from "@/utils/accommodationAdapter";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  hotel: EnrichedHotel;
}

export default function SacredProximityIndex({ hotel }: Props) {
  const [showRouteSteps, setShowRouteSteps] = useState(false);

  // If the API does not have proximity data yet, do not render static placeholder content
  if (!hasProximityData(hotel)) {
    return null;
  }

  const shrines = Array.isArray(hotel.nearby_shrines) ? hotel.nearby_shrines : [];

  return (
    <View style={styles.card}>
      {/* Sacred Gradient Top Border Accent */}
      <LinearGradient
        colors={["#904D00", "#FE932C", "#4E051A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />

      {/* Index Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name="compass-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.headerTitle}>SACRED PROXIMITY INDEX</Text>
        </View>

        {hotel.distance_to_mahakal ? (
          <View style={styles.proximityPill}>
            <Text style={styles.proximityPillText}>
              {hotel.distance_to_mahakal}
              {hotel.walk_time ? ` • ${hotel.walk_time}` : ""}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Sanctum Card */}
      <View style={styles.sanctumBox}>
        <View style={styles.templeIconCircle}>
          <MaterialCommunityIcons name="temple-hindu" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.sanctumInfo}>
          <Text style={styles.sanctumTitle}>Mahakaleshwar Jyotirlinga Sanctum</Text>
          <Text style={styles.sanctumPath}>
            {hotel.landmark_note || hotel.location}
          </Text>
        </View>
      </View>

      {/* Devotee Bhasma Aarti Advantage Callout (Dynamic from API) */}
      {hotel.bhasma_aarti_advantage ? (
        <View style={styles.bhasmaAartiCallout}>
          <MaterialCommunityIcons name="weather-sunset" size={18} color="#904D00" />
          <Text style={styles.bhasmaAartiText}>
            {hotel.bhasma_aarti_advantage}
          </Text>
        </View>
      ) : null}

      {/* Dynamic Walking Route Checkpoints (only if API returns nearby_shrines) */}
      {shrines.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.expandRouteBtn}
            activeOpacity={0.8}
            onPress={() => setShowRouteSteps((prev) => !prev)}
          >
            <MaterialCommunityIcons name="walk" size={17} color={COLORS.secondary} />
            <Text style={styles.expandRouteText}>
              {showRouteSteps ? "Hide Walking Checkpoints" : "View Sanctum Walking Route Checkpoints"}
            </Text>
            <Ionicons
              name={showRouteSteps ? "chevron-up" : "chevron-down"}
              size={16}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          {showRouteSteps && (
            <View style={styles.waypointsList}>
              {shrines.map((shrine, idx) => (
                <View key={shrine.id || idx} style={styles.waypointRow}>
                  <View
                    style={[
                      styles.waypointDot,
                      { backgroundColor: idx === shrines.length - 1 ? "#4E051A" : "#904D00" },
                    ]}
                  />
                  <Text
                    style={[
                      styles.waypointText,
                      idx === shrines.length - 1 && { fontFamily: FONTS.body.semiBold, color: "#4E051A" },
                    ]}
                  >
                    {shrine.title}
                    {shrine.distance_text ? ` (${shrine.distance_text})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: RADIUS.lg,
    backgroundColor: "#F6F3EE",
    padding: 14,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
    ...SHADOWS.xs,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
    letterSpacing: 1.1,
  },
  proximityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "rgba(144, 77, 0, 0.1)",
  },
  proximityPillText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
  },
  sanctumBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.06)",
  },
  templeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4E051A",
    justifyContent: "center",
    alignItems: "center",
  },
  sanctumInfo: {
    flex: 1,
  },
  sanctumTitle: {
    fontSize: 14,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
    marginBottom: 2,
  },
  sanctumPath: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#544244",
  },
  bhasmaAartiCallout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 10,
    padding: 10,
    backgroundColor: "rgba(255, 220, 195, 0.45)",
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: "#904D00",
  },
  bhasmaAartiText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#4A2800",
    lineHeight: 16,
  },
  expandRouteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
  },
  expandRouteText: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 12,
    fontFamily: FONTS.body.medium,
    color: "#4E051A",
  },
  waypointsList: {
    marginTop: 8,
    paddingLeft: 10,
    gap: 8,
  },
  waypointRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waypointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  waypointText: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#544244",
  },
});
