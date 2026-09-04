import { router } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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
          <Text style={styles.title}>Book Darshan & {"\n"}Tour Packages</Text>

          <Text style={styles.subtitle}>Ujjain Trusted Tirth App</Text>

          <TouchableOpacity onPress={explorePackages} style={styles.button}>
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
    borderRadius: 20,
  },

  overlay: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  subtitle: {
    color: "#eee",
    fontSize: 13,
    marginTop: 4,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#FF7A00",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
