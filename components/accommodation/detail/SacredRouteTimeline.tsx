import { SacredRouteNode } from "@/types/service";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";

import { COLORS } from "@/constants/colors";
interface Props {
  nodes: SacredRouteNode[];
}

export default function SacredRouteTimeline({ nodes }: Props) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <MaterialCommunityIcons name="compass-outline" size={15} color={COLORS.goldDeep} />
          <Text style={styles.tagText}>WALKING DISTANCE PATH</Text>
        </View>
        <Text style={styles.titleText}>Nearby Sacred Places</Text>
        <Text style={styles.subtext}>
          Walk the sacred trail of revered shrines directly from your room&apos;s doorstep
        </Text>
      </View>

      <View style={styles.timelineWrapper}>
        {/* Continuous Route Connector Line */}
        <View style={styles.connectorLine} />

        {nodes.map((node, idx) => {
          const isStay = node.is_stay || idx === 0;
          const isSanctum = node.tag?.toLowerCase() === "destination" || node.title.toLowerCase().includes("sanctum") || idx === nodes.length - 1;

          return (
            <View key={node.id || idx} style={styles.nodeWrapper}>
              {/* Node Icon Circle */}
              <View
                style={[
                  styles.nodeCircle,
                  isStay && styles.nodeCircleStay,
                  isSanctum && styles.nodeCircleSanctum,
                ]}
              >
                <MaterialCommunityIcons
                  name={node.icon as any || "temple-hindu"}
                  size={16}
                  color={isStay || isSanctum ? COLORS.white : COLORS.sacredDeep}
                />
              </View>

              {/* Node Card Content */}
              <View style={styles.nodeContent}>
                <View style={styles.nodeHeaderRow}>
                  <Text style={styles.nodeTitle}>{node.title}</Text>
                  {node.tag ? (
                    <View
                      style={[
                        styles.tagPill,
                        isStay && styles.tagPillStay,
                        isSanctum && styles.tagPillSanctum,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagPillText,
                          isStay && styles.tagPillTextStay,
                          isSanctum && styles.tagPillTextSanctum,
                        ]}
                      >
                        {node.tag}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.nodeDesc}>{node.description}</Text>

                {/* Distance & Time Metric */}
                {node.distance_text && node.distance_text !== "0 m" && (
                  <View style={styles.distanceBadge}>
                    <MaterialCommunityIcons name="walk" size={13} color={COLORS.goldDeep} />
                    <Text style={styles.distanceBadgeText}>
                      {node.distance_text} · {node.walk_time}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: COLORS.surfaceMuted,
    paddingBottom: 24,
  },
  header: {
    gap: 2,
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  tagText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.goldDeep,
    letterSpacing: 1.2,
    flexShrink: 1,
  },
  titleText: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacredDeep,
  },
  subtext: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
  },
  timelineWrapper: {
    position: "relative",
    paddingLeft: 4,
    gap: 16,
  },
  connectorLine: {
    position: "absolute",
    left: 17,
    top: 14,
    bottom: 24,
    width: 2,
    backgroundColor: COLORS.saffron,
    opacity: 0.45,
  },
  nodeWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  nodeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.bgStone,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    ...SHADOWS.xs,
  },
  nodeCircleStay: {
    backgroundColor: COLORS.sacredDeep,
  },
  nodeCircleSanctum: {
    backgroundColor: COLORS.goldDeep,
  },
  nodeContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: RADIUS.md,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.06)",
    ...SHADOWS.xs,
  },
  nodeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nodeTitle: {
    fontSize: 13,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacredDeep,
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceMuted,
  },
  tagPillStay: {
    backgroundColor: "#FFD9DD",
  },
  tagPillSanctum: {
    backgroundColor: "#FFDCC3",
  },
  tagPillText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: COLORS.inkBody,
    textTransform: "uppercase",
  },
  tagPillTextStay: {
    color: "#400013",
  },
  tagPillTextSanctum: {
    color: "#2F1500",
  },
  nodeDesc: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 15,
  },
  distanceBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(144, 77, 0, 0.08)",
    marginTop: 4,
  },
  distanceBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: COLORS.goldDeep,
    flexShrink: 1,
  },
});
