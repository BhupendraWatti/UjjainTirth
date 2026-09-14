import { SacredRouteNode } from "@/types/service";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
          <MaterialCommunityIcons name="compass-outline" size={15} color="#904D00" />
          <Text style={styles.tagText}>WALKING DISTANCE PATH</Text>
        </View>
        <Text style={styles.titleText}>Nearby Sacred Places</Text>
        <Text style={styles.subtext}>
          Walk the sacred trail of revered shrines directly from your room's doorstep
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
                  color={isStay || isSanctum ? "#FFFFFF" : "#4E051A"}
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
                    <MaterialCommunityIcons name="walk" size={13} color="#904D00" />
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
    backgroundColor: "#F6F3EE",
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
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 19,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
  },
  subtext: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#544244",
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
    backgroundColor: "#FE932C",
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
    backgroundColor: "#EBE8E3",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    ...SHADOWS.xs,
  },
  nodeCircleStay: {
    backgroundColor: "#4E051A",
  },
  nodeCircleSanctum: {
    backgroundColor: "#904D00",
  },
  nodeContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    color: "#4E051A",
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F0EDE9",
  },
  tagPillStay: {
    backgroundColor: "#FFD9DD",
  },
  tagPillSanctum: {
    backgroundColor: "#FFDCC3",
  },
  tagPillText: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#544244",
    textTransform: "uppercase",
  },
  tagPillTextStay: {
    color: "#400013",
  },
  tagPillTextSanctum: {
    color: "#2F1500",
  },
  nodeDesc: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#544244",
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
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
  },
});
