import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Jai Shree Mahakal</Text>
        <Text style={styles.subtitle}>
          Welcome to <Text style={styles.link}>Ujjaintirth.com</Text>
        </Text>
      </View>

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

  title: {
    fontSize: 20,
    fontFamily: FONTS.display.semiBold,
    color: COLORS.sacred,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.body.regular,
    color: COLORS.inkMuted,
    marginTop: 2,
  },

  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
  },

  link: {
    color: COLORS.inkMuted,
    fontFamily: FONTS.body.medium,
  },
});
