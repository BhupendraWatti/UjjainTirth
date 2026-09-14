import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";

export default function Header() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.brandLogo}
        resizeMode="contain"
        accessibilityLabel="Ujjain Tirth"
      />

      <TouchableOpacity style={styles.searchBtn} accessibilityRole="button" accessibilityLabel="Search">
        <Ionicons name="search" size={20} color={COLORS.inkBody} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  brandLogo: {
    width: 52,
    height: 52,
  },

  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
  },
});
