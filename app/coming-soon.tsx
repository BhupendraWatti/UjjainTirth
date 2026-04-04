import ScreenContainer from "@/components/layout/ScreenContainer";
import ComingSoon from "@/components/ui/ComingSoon";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ComingSoonScreen() {
  return (
    <ScreenContainer>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#2C2C2C" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <ComingSoon title="Coming Soon" subtitle="" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f4e5be",
    justifyContent: "center",
    alignItems: "center",

    // subtle elevation (premium feel)
    elevation: 2,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
