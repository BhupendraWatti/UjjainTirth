import { RoomTier } from "@/types/service";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  rooms: RoomTier[];
  selectedRoomId: string;
  onSelectRoom: (room: RoomTier) => void;
}

export default function RoomSelection({
  rooms,
  selectedRoomId,
  onSelectRoom,
}: Props) {
  // If API has not returned room tiers yet, do not render an empty container
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tagRow}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>SANCTUM ACCOMMODATIONS</Text>
        </View>
        <Text style={styles.titleText}>Select Your Room</Text>
        <Text style={styles.subtext}>
          Comfort for every kind of devotion & family journey
        </Text>
      </View>

      <View style={styles.roomsList}>
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          return (
            <TouchableOpacity
              key={room.id}
              style={[styles.roomCard, isSelected && styles.roomCardSelected]}
              activeOpacity={0.9}
              onPress={() => onSelectRoom(room)}
            >
              {/* Image & Badges */}
              <View style={styles.imageContainer}>
                {room.image ? (
                  <Image
                    source={{ uri: room.image }}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[StyleSheet.absoluteFillObject, styles.placeholder]}>
                    <MaterialCommunityIcons name="bed-king-outline" size={36} color="#877274" />
                  </View>
                )}

                {/* Badge Overlay */}
                {room.badge && (
                  <View style={styles.badgePill}>
                    <Ionicons name="star" size={11} color="#FFDF98" />
                    <Text style={styles.badgePillText}>{room.badge}</Text>
                  </View>
                )}

                {/* Area Tag */}
                {room.size_sqft && (
                  <View style={styles.areaTag}>
                    <Text style={styles.areaText}>{room.size_sqft}</Text>
                  </View>
                )}
              </View>

              {/* Room Body */}
              <View style={styles.body}>
                <View style={styles.titlePriceRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roomTitle}>{room.title}</Text>
                    {room.view ? (
                      <View style={styles.viewRow}>
                        <MaterialCommunityIcons name="flower" size={13} color="#904D00" />
                        <Text style={styles.viewText}>{room.view}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.priceAmount}>
                      ₹{room.price.toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.priceUnit}>/ night</Text>
                  </View>
                </View>

                {/* Spec Pills */}
                <View style={styles.specsRow}>
                  <View style={styles.specChip}>
                    <MaterialCommunityIcons name="account-group" size={13} color="#544244" />
                    <Text style={styles.specText}>{room.max_guests} Guests</Text>
                  </View>

                  <View style={styles.specChip}>
                    <MaterialCommunityIcons name="bed" size={13} color="#544244" />
                    <Text style={styles.specText}>{room.beds}</Text>
                  </View>
                </View>

                {/* Inclusions */}
                {room.amenity_highlights && room.amenity_highlights.length > 0 && (
                  <View style={styles.inclusionsRow}>
                    {room.amenity_highlights.map((item, idx) => (
                      <View key={idx} style={styles.inclusionItem}>
                        <Ionicons name="checkmark-circle" size={13} color="#904D00" />
                        <Text style={styles.inclusionText}>{item}</Text>
                        {idx < room.amenity_highlights.length - 1 && (
                          <Text style={styles.bullet}>•</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Bottom Row: Tax note & Select button */}
                <View style={styles.footerRow}>
                  <Text style={styles.taxText}>Inclusive of sacred tirth taxes</Text>

                  <View
                    style={[
                      styles.selectBtn,
                      isSelected ? styles.selectBtnActive : styles.selectBtnInactive,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" style={{ marginRight: 3 }} />
                    )}
                    <Text
                      style={[
                        styles.selectBtnText,
                        isSelected && styles.selectBtnTextActive,
                      ]}
                    >
                      {isSelected ? "Selected" : "Select Room"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
    gap: 14,
  },
  header: {
    gap: 3,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#904D00",
  },
  tagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
    letterSpacing: 1.2,
  },
  titleText: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
  },
  subtext: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "#544244",
  },
  roomsList: {
    gap: 14,
  },
  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
    ...SHADOWS.xs,
  },
  roomCardSelected: {
    borderColor: "#904D00",
    borderWidth: 1.5,
    ...SHADOWS.md,
  },
  imageContainer: {
    width: "100%",
    height: 160,
    position: "relative",
    backgroundColor: "#EBE8E3",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  badgePill: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: "rgba(78, 5, 26, 0.9)",
  },
  badgePillText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  areaTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  areaText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#4E051A",
  },
  body: {
    padding: 14,
    gap: 10,
  },
  titlePriceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  roomTitle: {
    fontSize: 16,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
  },
  viewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  viewText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#904D00",
  },
  priceCol: {
    alignItems: "flex-end",
  },
  priceAmount: {
    fontSize: 18,
    fontFamily: FONTS.display.bold,
    color: "#4E051A",
  },
  priceUnit: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: "#877274",
  },
  specsRow: {
    flexDirection: "row",
    gap: 6,
  },
  specChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    backgroundColor: "#F0EDE9",
  },
  specText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#544244",
  },
  inclusionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  inclusionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  inclusionText: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#544244",
  },
  bullet: {
    fontSize: 10,
    color: "#A09895",
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(107, 29, 47, 0.06)",
  },
  taxText: {
    fontSize: 10,
    fontFamily: FONTS.body.regular,
    color: "#877274",
  },
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  selectBtnActive: {
    backgroundColor: "#4E051A",
  },
  selectBtnInactive: {
    backgroundColor: "#F0EDE9",
  },
  selectBtnText: {
    fontSize: 12,
    fontFamily: FONTS.body.bold,
    color: "#4E051A",
  },
  selectBtnTextActive: {
    color: "#FFFFFF",
  },
});
