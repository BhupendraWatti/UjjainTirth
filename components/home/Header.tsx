import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants/colors";

const LOGO_REMOTE_URL = "https://ujjaintirth.com/wp-content/uploads/2023/02/ujjain_tirth_logo.png";
const LOGO_LOCAL_ASSET = require("../../assets/images/ujjain_tirth_logo.png");

export default function Header() {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={useFallback ? LOGO_LOCAL_ASSET : { uri: LOGO_REMOTE_URL }}
        defaultSource={LOGO_LOCAL_ASSET}
        onError={() => setUseFallback(true)}
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
    width: 156,
    height: 38,
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
