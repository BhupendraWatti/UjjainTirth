import { EnrichedHotel, getHotelAboutText } from "@/utils/accommodationAdapter";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  hotel: EnrichedHotel;
}

export default function AboutSanctuary({ hotel }: Props) {
  const aboutText = getHotelAboutText(hotel);
  const secondaryImage = hotel.gallery && hotel.gallery.length > 1 ? hotel.gallery[1] : null;

  // If there is no custom about text from API and no secondary photo, keep it clean
  if (!aboutText && !secondaryImage && !hotel.bhasma_aarti_advantage) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Editorial Story (from API) */}
      {aboutText ? (
        <View>
          <Text style={styles.tagText}>{hotel.category ? hotel.category.toUpperCase() : "ACCOMMODATION"}</Text>
          <Text style={styles.headline}>About {hotel.name}</Text>
          <Text style={styles.description}>{aboutText}</Text>
        </View>
      ) : null}

      {/* Secondary Photo from API Gallery (only if exists) */}
      {secondaryImage ? (
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: secondaryImage }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>{hotel.name} View</Text>
          </View>
        </View>
      ) : null}

      {/* Dynamic Bhasma Aarti Advantage Banner (only if API returns it) */}
      {hotel.bhasma_aarti_advantage ? (
        <LinearGradient
          colors={["#4E051A", "#6B1D2F", "#904D00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>PILGRIM ADVANTAGE</Text>
            <Text style={styles.bannerHeadline}>Bhasma Aarti Access</Text>
            <Text style={styles.bannerDesc}>
              {hotel.bhasma_aarti_advantage}
            </Text>
          </View>
          <View style={styles.bannerIconBox}>
            <MaterialIcons name="wb-sunny" size={26} color="#FFDF98" />
          </View>
        </LinearGradient>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  tagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headline: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: "#544244",
    lineHeight: 20,
    marginTop: 6,
  },
  photoContainer: {
    width: "100%",
    height: 180,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#EBE8E3",
  },
  photoBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(78, 5, 26, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  photoBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.body.medium,
    color: "#FFFFFF",
  },
  banner: {
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    ...SHADOWS.sm,
  },
  bannerTag: {
    fontSize: 9,
    fontFamily: FONTS.body.bold,
    color: "#FFDF98",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  bannerHeadline: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  bannerDesc: {
    fontSize: 11,
    fontFamily: FONTS.body.regular,
    color: "#F0EDE9",
    lineHeight: 16,
  },
  bannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});
