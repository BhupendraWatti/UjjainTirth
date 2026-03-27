import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  title?: string;
  address?: string;
  onPress: () => void;
}

const getMapImage = (lat?: number, lng?: number) => {
  if (
    lat === undefined ||
    lng === undefined ||
    isNaN(lat) ||
    isNaN(lng) ||
    lat === 0 ||
    lng === 0
  )
    return fallbackImage;

  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red|${lat},${lng}`;
};

const fallbackImage =
  "https://via.placeholder.com/600x300?text=Map+Unavailable";
const MapCard = ({
  latitude,
  longitude,
  mapUrl,
  title,
  address,
  onPress,
}: Props) => {
  // console.log("MAP URL:", getMapImage(latitude, longitude));
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: getMapImage(latitude, longitude),
        }}
        style={styles.map}
      />

      <View style={styles.overlay}>
        <View>
          <Text style={styles.locationTitle}>{title}</Text>
          <Text style={styles.locationSub}>{address}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(MapCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  map: {
    width: "100%",
    height: 150,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  locationTitle: {
    fontWeight: "600",
    fontSize: 13,
  },
  locationSub: {
    fontSize: 11,
    color: "#666",
  },
  button: {
    backgroundColor: "#EB5C49",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 11,
  },
});
