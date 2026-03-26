import { Service } from "@/types/service";
import { LinearGradient } from "expo-linear-gradient";
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
const CARD_WIDTH = (width - 50) / 2; // spacing logic
const ServiceGrid = ({ services }: { services: Service[] }) => {
  const renderItem = ({ item, index }: { item: Service; index: number }) => {
    const icon = item?.acf?.service_icon;

    // 🔥 Zig-zag logic
    const row = Math.floor(index / 2);
    const isEvenRow = row % 2 === 0;
    const isLeft = index % 2 === 0;
    const useOrange = isEvenRow ? isLeft : !isLeft;
    return (
      <TouchableOpacity activeOpacity={0.8}>
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
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  icon: {
    width: 50,
    height: 50,
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
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
