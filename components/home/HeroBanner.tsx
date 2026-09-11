import { router } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";

export default function HeroBanner() {
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(350, Math.max(240, height * 0.48));
  const explorePackages = () => router.push("/(tabs)/packages");

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("@/assets/images/Mahakaleshwar-1.jpeg")}
        style={[styles.container, { height: heroHeight }]}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Book Darshan &{"\n"}Tour Packages</Text>

          <Text style={styles.subtitle}>Ujjain Trusted Tirth App</Text>

          <TouchableOpacity
            onPress={explorePackages}
            style={styles.button}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Explore Packages Now"
          >
            <Text style={styles.buttonText}>Explore Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
    paddingHorizontal: 0,
  },

  container: {
    width: "100%",
    justifyContent: "flex-end",
  },

  image: {
    borderRadius: RADIUS.md,
  },

  overlay: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: RADIUS.md,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    lineHeight: 26,
  },

  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontFamily: FONTS.body.medium,
    marginTop: 4,
  },

  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FONTS.body.semiBold,
  },
});
