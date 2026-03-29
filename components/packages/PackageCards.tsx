import { Package } from "@/types/product";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Package;
  onPress: () => void;
}

export default function PackageCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.duration}>{item.duration}</Text>

        <View style={styles.footer}>
          <Text style={styles.price}>₹ {item.price}</Text>
          <Text style={styles.cta}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  duration: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EB5C49",
  },
  cta: {
    fontSize: 13,
    color: "#3A3A3A",
  },
});
