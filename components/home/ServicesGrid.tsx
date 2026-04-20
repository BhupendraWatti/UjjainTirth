import { Service } from "@/types/service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 45) / 2;

const ServiceGrid = ({ services }: { services: Service[] }) => {
  const router = useRouter();

  const handleServicePress = (item: Service) => {
    const serviceType = item.type?.toLowerCase();
    if (serviceType === "accommodation") {
      router.push("/services/accommodation" as any);
    } else {
      router.push("/coming-soon");
    }
  };

  const renderItem = ({ item, index }: { item: Service; index: number }) => {
    const icon = item?.acf_legacy?.service_icon;

    // 🔥 Zig-zag logic
    const row = Math.floor(index / 2);
    const isEvenRow = row % 2 === 0;
    const isLeft = index % 2 === 0;
    const useOrange = isEvenRow ? isLeft : !isLeft;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleServicePress(item)}
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
              style={styles.icon}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder} />
          )}

          <Text style={styles.title}>
            {item?.acf_legacy?.service_name || "Service"}
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
    width: CARD_WIDTH,
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  icon: {
    width: 200,
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
