import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecommendationSection() {
  const router = useRouter();
  const goToPuja = () => {
    router.push("/(tabs)/puja");
  };
  const goToPackages = () => {
    router.push("/(tabs)/packages");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommendation</Text>

      {/* Card 1 */}
      <View style={styles.card}>
        <Text style={styles.title}>Plan Your Spiritual Journey</Text>

        <Text style={styles.desc}>
          Tell us your dates, temples, stay, and transport — we’ll arrange
          everything for you.
        </Text>

        <TouchableOpacity style={styles.button} onPress={goToPackages}>
          <Text style={styles.buttonText}>Create My Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Card 2 */}
      <View style={styles.card}>
        <Text style={styles.title}>Book Your Puja Slot Easily</Text>

        <Text style={styles.desc}>
          Reserve your preferred puja at Mahakaleshwar Temple with simple
          booking.
        </Text>

        <TouchableOpacity style={styles.button} onPress={goToPuja}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginTop: 20,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B1E1E",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },

  desc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#FF7A00",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
