import { HotelAmenity } from "@/types/service";
import { FONTS } from "@/constants/typography";
import { RADIUS } from "@/constants/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  amenities: HotelAmenity[];
}

/** Function line to dynamically resolve icons for amenity names coming from API/ACF */
export function getAmenityIcon(name: string): { icon: string; pack: "material" | "community" } {
  const lower = (name || "").toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) {
    return { icon: "wifi", pack: "material" };
  }
  if (lower.includes("ac") || lower.includes("air condition") || lower.includes("cool")) {
    return { icon: "ac-unit", pack: "material" };
  }
  if (lower.includes("park") || lower.includes("vehicle")) {
    return { icon: "local-parking", pack: "material" };
  }
  if (lower.includes("food") || lower.includes("bhojan") || lower.includes("restaurant") || lower.includes("satvik")) {
    return { icon: "restaurant", pack: "material" };
  }
  if (lower.includes("water") || lower.includes("hot water") || lower.includes("geyser")) {
    return { icon: "water-drop", pack: "material" };
  }
  if (lower.includes("power") || lower.includes("backup") || lower.includes("generator")) {
    return { icon: "flash-on", pack: "material" };
  }
  if (lower.includes("desk") || lower.includes("support") || lower.includes("help") || lower.includes("service")) {
    return { icon: "support-agent", pack: "material" };
  }
  if (lower.includes("puja") || lower.includes("darshan") || lower.includes("mandir") || lower.includes("temple")) {
    return { icon: "hands-pray", pack: "community" };
  }
  if (lower.includes("lift") || lower.includes("elevator")) {
    return { icon: "elevator", pack: "material" };
  }
  return { icon: "check-circle-outline", pack: "material" };
}

export default function YatraAmenities({ amenities }: Props) {
  // If API has not returned any amenities for this stay, do not show static mock data
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tagText}>COMFORTS & FACILITIES</Text>
        <Text style={styles.titleText}>Amenities & Devotee Services</Text>
      </View>

      <View style={styles.grid}>
        {amenities.map((item, idx) => {
          const iconMeta = getAmenityIcon(item.name);
          return (
            <View key={item.name || idx} style={styles.amenityItem}>
              <View style={styles.iconCircle}>
                {iconMeta.pack === "material" ? (
                  <MaterialIcons name={iconMeta.icon as any} size={20} color="#4E051A" />
                ) : (
                  <MaterialCommunityIcons name={iconMeta.icon as any} size={20} color="#904D00" />
                )}
              </View>
              <Text style={styles.amenityLabel} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  header: {
    gap: 2,
  },
  tagText: {
    fontSize: 10,
    fontFamily: FONTS.body.bold,
    color: "#904D00",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  titleText: {
    fontSize: 18,
    fontFamily: FONTS.display.semiBold,
    color: "#4E051A",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityItem: {
    width: "23%",
    alignItems: "center",
    backgroundColor: "#F6F3EE",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: RADIUS.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  amenityLabel: {
    fontSize: 10,
    fontFamily: FONTS.body.medium,
    color: "#1C1C19",
    textAlign: "center",
  },
});
