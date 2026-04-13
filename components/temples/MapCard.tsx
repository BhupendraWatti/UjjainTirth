import { formatDistance } from "@/hooks/useTempleDistances";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  title?: string;
  address?: string;
  /** Distance in km from the user (from useTempleDistances hook) */
  distanceKm?: number | null;
  onPress: () => void;
}

const fallbackImage =
  "https://via.placeholder.com/600x300?text=Map+Unavailable";

/**
 * Resolve coordinates for the static map image.
 * Uses the same strategy as the distance hook:
 *   1. API lat/lng (acf.latitude / acf.longitude)
 *   2. Extract from map_url (Google Maps URL)
 */
function resolveCoordinates(
  lat?: number,
  lng?: number,
  mapUrl?: string
): { lat: number; lng: number } | null {
  // 1. API coordinates
  if (
    lat !== undefined &&
    lng !== undefined &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat !== 0 &&
    lng !== 0
  ) {
    return { lat, lng };
  }

  // 2. Fallback — extract from map_url
  if (mapUrl) {
    const atMatch = mapUrl.match(/@([\d.-]+),([\d.-]+)/);
    if (atMatch) {
      const parsedLat = parseFloat(atMatch[1]);
      const parsedLng = parseFloat(atMatch[2]);
      if (!isNaN(parsedLat) && !isNaN(parsedLng) && parsedLat !== 0 && parsedLng !== 0) {
        return { lat: parsedLat, lng: parsedLng };
      }
    }
  }

  return null;
}

function getMapImage(
  lat?: number,
  lng?: number,
  mapUrl?: string
): string {
  const coords = resolveCoordinates(lat, lng, mapUrl);
  if (!coords) return fallbackImage;

  return `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=15&size=600x300&markers=color:red|${coords.lat},${coords.lng}`;
}

const MapCard = ({
  latitude,
  longitude,
  mapUrl,
  title,
  address,
  distanceKm,
  onPress,
}: Props) => {
  const mapImage = getMapImage(latitude, longitude, mapUrl);
  const distText = formatDistance(distanceKm);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: mapImage }}
        style={styles.map}
      />

      <View style={styles.overlay}>
        <View style={styles.infoBlock}>
          <Text style={styles.locationTitle}>{title}</Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.locationSub}>{address}</Text>
            {distText && (
              <View style={styles.distancePill}>
                <Text style={styles.distanceText}>📍 {distText}</Text>
              </View>
            )}
          </View>
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
  infoBlock: {
    flex: 1,
    marginRight: 8,
  },
  locationTitle: {
    fontWeight: "600",
    fontSize: 13,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  locationSub: {
    fontSize: 11,
    color: "#666",
  },
  distancePill: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2E7D32",
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
