import { AccommodationHero } from "@/types/service";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  hero: AccommodationHero;
}

const HeroSection = ({ hero }: Props) => {
  const hasImage = hero.image !== null;

  const content = (
    <>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Title & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{hero.title}</Text>
        {hero.subtitle ? (
          <Text style={styles.subtitle}>{hero.subtitle}</Text>
        ) : null}
      </View>
    </>
  );

  if (hasImage) {
    return (
      <ImageBackground
        source={{ uri: hero.image! }}
        style={styles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.75)"]}
          style={styles.overlay}
        />
        {content}
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, "#8B1E1E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {content}
    </LinearGradient>
  );
};

export default React.memo(HeroSection);

const styles = StyleSheet.create({
  container: {
    width,
    height: 280,
    justifyContent: "flex-end",
    position: "relative",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  textContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: -0.3,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    letterSpacing: 0.1,
  },
});
