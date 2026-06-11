import { Service } from "@/types/service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const ServiceGrid = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const numColumns = isTablet ? 3 : 2;
  
  // Calculate dynamic card width
  const cardWidth = isTablet 
    ? (width - 32 - (12 * 2)) / 3 
    : (width - 45) / 2;

  const handleServicePress = useCallback((item: Service) => {
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
  }, [router]);

  const renderItem = useCallback(({ item, index }: { item: Service; index: number }) => {
    const icon = item?.acf?.service_icon;

    // 🔥 Zig-zag logic
    const row = Math.floor(index / numColumns);
    const isEvenRow = row % 2 === 0;
    const isLeft = index % numColumns === 0;
    const useOrange = isEvenRow ? isLeft : !isLeft;

    return (
      <TouchableOpacity
        key={item.id}
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
          style={[styles.card, { width: cardWidth }]}
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
  }, [numColumns, cardWidth, handleServicePress]);

  const rows = [];
  const safeServices = services || [];
  for (let i = 0; i < safeServices.length; i += numColumns) {
    rows.push(safeServices.slice(i, i + numColumns));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, colIndex) => {
            const index = rowIndex * numColumns + colIndex;
            return renderItem({ item, index });
          })}
          {row.length < numColumns &&
            Array.from({ length: numColumns - row.length }).map((_, index) => (
              <View key={`empty-${index}`} style={{ width: cardWidth }} />
            ))}
        </View>
      ))}
    </View>
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
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  icon: {
    width: "85%",
    height: 100,
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
