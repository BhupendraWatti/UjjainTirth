import React, { memo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

/* ============================= */
/* HEADER COMPONENT */
/* ============================= */
const Header = memo(() => (
  <View style={styles.headerContainer}>
    <View>
      <Text style={styles.title}>Har Har Mahadev</Text>
      <Text style={styles.subtitle}>Namaste, User</Text>
    </View>

    <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
      <Ionicons name="search" size={20} color="#333" />
    </TouchableOpacity>
  </View>
));

/* ============================= */
/* HERO BANNER COMPONENT */
/* ============================= */
const HeroBanner = memo(() => (
  <View style={styles.heroWrapper}>
    <Image
      source={{
        uri: "./assets/images/MahaKaleshwar-1.jpeg",
      }}
      contentFit="cover"
      style={styles.heroImage}
    />

    {/* Gradient Overlay */}
    <LinearGradient
      colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"]}
      style={styles.overlay}
    />

    {/* Content */}
    <View style={styles.heroContent}>
      <Text style={styles.heroTitle}>
        Book Darshan &{"\n"}Tour Packages
      </Text>

      <Text style={styles.heroSubtitle}>
        Plan your spiritual journey with ease.
      </Text>

      <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
        <Text style={styles.ctaText}>Explore Now</Text>
      </TouchableOpacity>
    </View>

    <View>
      
    </View>


  </View>

  
));

/* ============================= */
/* MAIN SCREEN */
/* ============================= */
export default function HomeScreen() {
  return (
    <ScrollView 
      style={styles.screen}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Header />
      <HeroBanner />
    </ScrollView>
  );
}

/* ============================= */
/* STYLES */
/* ============================= */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f2ea",
  },

  /* HEADER */
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#941E3C",
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8E5E0",
    justifyContent: "center",
    alignItems: "center",
  },

  /* HERO SECTION */
  heroWrapper: {
    width: width - 0,
    height: 240,
    alignSelf: "center",
    borderRadius: 0,
    overflow: "hidden",
    marginTop: 10,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 30,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#f1f1f1",
  },
  ctaButton: {
    marginTop: 18,
    backgroundColor: "#FF7A1A",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 24,
    alignSelf: "flex-start",
    elevation: 3,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});