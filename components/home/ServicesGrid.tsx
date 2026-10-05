import { Service } from "@/types/service";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
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
  const isCompact = width < 375;
  const sidePadding = 16;
  const gap = 10;
  const cardWidth = Math.floor((width - sidePadding * 2 - gap) / 2);
  const cardHeight = isCompact ? 124 : 134;
  const iconHeight = isCompact ? 66 : 74;
  const iconWidth = Math.min(150, cardWidth - 20);

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

  const renderItem = (item: Service, index: number) => {
    const icon = item?.acf?.service_icon;

    // Classic 2-column zig-zag alternating colors
    const row = Math.floor(index / 2);
    const isEvenRow = row % 2 === 0;
    const isLeft = index % 2 === 0;
    const useOrange = isEvenRow ? isLeft : !isLeft;

    return (
      <TouchableOpacity
        key={item.id ? item.id.toString() : `service-${index}`}
        activeOpacity={0.82}
        onPress={() => handleServicePress(item)}
        style={{ width: cardWidth, marginBottom: gap }}
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
          style={[styles.card, { minHeight: cardHeight }]}
        >
          {typeof icon === "string" && icon.trim() !== "" ? (
            <Image
              source={{ uri: icon.trim() }}
              style={[styles.icon, { width: iconWidth, height: iconHeight }]}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder} />
          )}

          <Text
            style={[styles.title, isCompact && styles.titleCompact]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.25}
          >
            {item?.acf?.service_name || "Service"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {services.map((item, index) => renderItem(item, index))}
      </View>
    </View>
  );
};

export default ServiceGrid;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "100%",
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.card,
  },

  icon: {
    marginBottom: 6,
  },

  placeholder: {
    width: 38,
    height: 38,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 19,
    marginBottom: 6,
  },

  title: {
    fontSize: 13.5,
    fontFamily: FONTS.display.semiBold,
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 17,
    paddingHorizontal: 2,
  },

  titleCompact: {
    fontSize: 12,
    lineHeight: 15,
  },
});
