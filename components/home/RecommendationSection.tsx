import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";

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
        <Text style={styles.title}>Customize Your Trip</Text>

        <Text style={styles.desc}>
          Plan your complete Ujjain trip with stay, darshan, and transport in
          one place.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={goToPackages}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Plan My Trip"
        >
          <Text style={styles.buttonText}>Plan My Trip</Text>
        </TouchableOpacity>
      </View>

      {/* Card 2 */}
      <View style={styles.card}>
        <Text style={styles.title}>Arrange Your Puja</Text>

        <Text style={styles.desc}>
          Get assistance for puja in Ujjain with verified pandits and smooth
          coordination.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={goToPuja}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Book Puja Instantly"
        >
          <Text style={styles.buttonText}>Book Puja Instantly</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginTop: 20,
    paddingBottom: 0,
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.surfaceMuted,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.hairline,
    ...SHADOWS.subtle,
  },

  title: {
    fontSize: 17,
    fontFamily: FONTS.display.regular,
    marginBottom: 6,
    color: COLORS.ink,
  },

  desc: {
    fontSize: 13.5,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkBody,
    lineHeight: 19,
    marginBottom: 12,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontFamily: FONTS.body.semiBold,
  },
});
