import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Jai Shree Mahakal</Text>
        <Text style={styles.subtitle}>
          Welcome to{" "}
          <Text
          // style={styles.link}
          // onPress={() => Linking.openURL("https://ujjaintirth.com")}
          >
            Ujjaintirth.com
          </Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.searchBtn}>
        <Ionicons name="search" size={20} color="#333" />
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
    fontSize: 18,
    fontWeight: "700",
    color: "#8B1E1E",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
    fontWeight: "400",
  },

  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    color: "#777",
    textDecorationLine: "none",
    fontWeight: 500,
  },
});
