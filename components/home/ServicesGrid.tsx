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
import { COLORS } from "@/constants/colors";
import { FONTS } from "@/constants/typography";
import { RADIUS, SHADOWS } from "@/constants/theme";

const ServiceGrid = ({ services }: { services: Service[] }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2;
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
    } else if (
      name === "transport" ||
      name === "transport service" ||
      name === "transport services" ||
      name === "cabs" ||
      name === "taxi"
    ) {
      router.push("/services/transport" as any);
    } else if (
      name === "pooja" ||
      name === "puja" ||
      name === "poojas" ||
      name === "online puja" ||
      name === "sacred pooja"
    ) {
      router.push("/services/pooja" as any);
    } else if (
      name.includes("narmada") ||
      name.includes("parikrama") ||
      name.includes("parikarma")
    ) {
      router.push("/services/narmada-parikrama" as any);
    } else {
      router.push("/coming-soon");
    }
  };

  const renderItem = ({ item, index }: { item: Service; index: number }) => {
    const icon = item?.acf?.service_icon;

    // Zig-zag logic preserved
    const row = Math.floor(index / 2);
    const isEvenRow = row % 2 === 0;
    const isLeft = index % 2 === 0;
    const useOrange = isEvenRow ? isLeft : !isLeft;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleServicePress(item)}
        style={{ width: cardWidth }}
        accessibilityRole="button"
        accessibilityLabel={item?.acf?.service_name || "Service"}
      >
        <LinearGradient
          colors={
            useOrange
              ? [COLORS.primary, COLORS.primaryDeep]
              : ["#9E2A3A", COLORS.sacred]
          }
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.card}
        >
          {typeof icon === "string" && icon.trim() !== "" ? (
            <Image
              source={{ uri: icon.trim() }}
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
    paddingVertical: 12,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },

  card: {
    width: "100%",
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  icon: {
    height: 130,
    marginBottom: 10,
  },

  placeholder: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    marginBottom: 10,
  },

  title: {
    fontSize: 15,
    fontFamily: FONTS.display.semiBold,
    textAlign: "center",
    color: "#FFFFFF",
    paddingBottom: 20,
  },
});
