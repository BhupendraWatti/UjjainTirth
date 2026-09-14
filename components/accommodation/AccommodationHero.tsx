import { AccommodationHero as AccommodationHeroType } from "@/types/service";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  hero: AccommodationHeroType;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterPress?: () => void;
}

export default function AccommodationHero({
  hero,
  searchQuery,
  onSearchChange,
  onFilterPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const imageUri = hero.image && hero.image.trim() !== "" ? hero.image : null;

  return (
    <View style={styles.container}>
      {/* Background Image (only if provided by API) */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={300}
        />
      ) : null}

      {/* Atmospheric Gradient Scrim */}
      <LinearGradient
        colors={[
          "rgba(78, 5, 26, 0.85)",
          "rgba(107, 29, 47, 0.90)",
          "rgba(78, 5, 26, 0.98)",
        ]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* In-hero Header Bar */}
      <View style={[styles.topBar, { paddingTop: Math.max(12, insets.top + 6) }]}>
        <TouchableOpacity
          style={styles.circleButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Location Selector */}
        <View style={styles.locationPill}>
          <Ionicons name="location-sharp" size={15} color={COLORS.gold} />
          <Text style={styles.locationText}>Ujjain, MP</Text>
        </View>

        <TouchableOpacity
          style={styles.circleButton}
          activeOpacity={0.7}
          accessibilityLabel="Saved stays"
        >
          <Ionicons name="bookmark-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Hero Pitch & Typography (from API) */}
      <View style={styles.pitchContent}>
        <View style={styles.tagRow}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>SANCTUM ACCOMMODATION</Text>
        </View>

        <Text style={styles.headline}>
          {hero.title || "Find Your Perfect Stay"}
        </Text>

        {hero.subtitle ? (
          <Text style={styles.subtext}>
            {hero.subtitle}
          </Text>
        ) : null}
      </View>

      {/* Floating Anchored Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <View style={styles.searchIconBox}>
            <MaterialCommunityIcons name="temple-hindu" size={22} color={COLORS.primary} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotels, ghats, dharamshalas..."
            placeholderTextColor="#877274"
            value={searchQuery}
            onChangeText={onSearchChange}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={0.8}
            onPress={onFilterPress}
            accessibilityLabel="Filter stays"
          >
            <Ionicons name="options-outline" size={18} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 380,
    width: "100%",
    position: "relative",
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  locationText: {
    fontSize: 11,
    fontFamily: FONTS.body.bold,
    color: "#FFFFFF",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  pitchContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FE932C",
  },
  tagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: COLORS.gold,
    letterSpacing: 1.5,
  },
  headline: {
    fontSize: 27,
    fontFamily: FONTS.display.semiBold,
    color: "#FCF9F4",
    lineHeight: 33,
  },
  headlineItalic: {
    fontFamily: FONTS.display.regular,
    fontStyle: "italic",
    color: "#FFDF98",
  },
  subtext: {
    fontSize: 12,
    fontFamily: FONTS.body.regular,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 18,
    marginTop: 6,
    maxWidth: "92%",
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: -22,
    zIndex: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    padding: 6,
    borderWidth: 1,
    borderColor: "rgba(107, 29, 47, 0.08)",
    ...SHADOWS.md,
  },
  searchIconBox: {
    paddingLeft: 8,
    paddingRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.body.regular,
    color: COLORS.ink,
    paddingVertical: 6,
  },
  filterButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: "#6B1D2F",
    justifyContent: "center",
    alignItems: "center",
  },
});
