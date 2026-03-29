import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HeroBanner() {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("@/assets/images/Mahakaleshwar-1.jpeg")}
        style={styles.container}
        imageStyle={styles.image}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Book Darshan & {"\n"}Tour Packages</Text>

          <Text style={styles.subtitle}>Ujjain trusted tirth App</Text>

          <TouchableOpacity style={styles.button}>
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
    height: 300,
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
    fontSize: 12,
    marginTop: 4,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#FF7A00",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
});
