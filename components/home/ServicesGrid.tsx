import { Service } from "@/types/service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const ServiceGrid = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 76) / 2;
  const iconWidth = Math.min(200, cardWidth - 20);

  const handleServicePress = (item: Service) => {
    const name = item?.acf?.service_name?.toLowerCase()?.trim();
    if (name === "accommodation") {
      router.push("/services/accommodation" as any);
    } else if (
      name === "jyotirlinga tour" ||
      name === "jyotirling tour" ||
      name === "jyotirling tours" ||
      name === "jyotirlinga tours" ||
      name === "jyotirlingas"
    ) {
      router.push("/services/jyotirlingas" as any);
    } else {
      router.push("/coming-soon");
    }
  };

  const renderItem = ({ item, index }: { item: Service; index: number }) => {
    const icon = item?.acf?.service_icon;

    // 🔥 Zig-zag logic
    const row = Math.floor(index / 2);
    const isEvenRow = row % 2 === 0;
    const isLeft = index % 2 === 0;
    const useOrange = isEvenRow ? isLeft : !isLeft;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleServicePress(item)}
        style={{ width: cardWidth }}
      >
        <LinearGradient
          colors={
            useOrange
              ? ["#f9c3a2", "#fb9353"] // ORANGE
              : ["#c45e71", "#922c45"] // MAROON
          }
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {icon ? (
            <Image
              source={{ uri: icon }}
              style={[styles.icon, { width: iconWidth }]}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder} />
          )}

          <Text style={styles.title}>
            {item?.acf?.service_name || "Service"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={services || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

export default ServiceGrid;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  card: {
    width: "100%",
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  icon: {
    height: 130,
    marginBottom: 10,
  },

  placeholder: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 25,
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
    paddingBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
