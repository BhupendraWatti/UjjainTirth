import {
  LOCATION_CONFIG,
  TEMPLE_COORDINATES,
} from "@/constants/templeCoordinates";
import { Temple } from "@/types/temple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────
export interface UserLocation {
  latitude: number;
  longitude: number;
}

export type LocationStatus = "loading" | "granted" | "denied" | "unavailable";

export interface DistanceMap {
  [templeId: number]: number | null; // distance in km, null = unknown
}

// ─── Haversine Formula ────────────────────────────────────────────
/**
 * Calculate the straight-line distance between two GPS coordinates.
 * Returns distance in kilometers.
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Extract coordinates from map_url ─────────────────────────────
/**
 * Try to extract lat/lng from Google Maps URL in the API response.
 * Example URL: "https://www.google.com/maps/dir/23.1479492,75.7956608/..."
 */
function extractCoordsFromMapUrl(
  mapUrl: string
): { lat: number; lng: number } | null {
  if (!mapUrl) return null;

  // Pattern 1: /dir/lat,lng/
  const dirMatch = mapUrl.match(/\/dir\/([\d.-]+),([\d.-]+)/);
  if (dirMatch) {
    // This is the USER's location in the directions URL, skip it
    // Try to find the destination coordinates
    const destMatch = mapUrl.match(/@([\d.-]+),([\d.-]+)/);
    if (destMatch) {
      const lat = parseFloat(destMatch[1]);
      const lng = parseFloat(destMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
  }

  // Pattern 2: @lat,lng
  const atMatch = mapUrl.match(/@([\d.-]+),([\d.-]+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Pattern 3: ?q=lat,lng or place/lat,lng
  const qMatch = mapUrl.match(/[?&]q=([\d.-]+),([\d.-]+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

// ─── Get temple coordinates (API → hardcoded fallback) ───────────
function getTempleCoords(
  temple: Temple
): { lat: number; lng: number } | null {
  // 1. Try API lat/lng fields
  const apiLat = parseFloat(temple.acf?.latitude || "");
  const apiLng = parseFloat(temple.acf?.longitude || "");
  if (!isNaN(apiLat) && !isNaN(apiLng) && apiLat !== 0 && apiLng !== 0) {
    return { lat: apiLat, lng: apiLng };
  }

  // 2. Try hardcoded coordinates by slug
  const hardcoded = TEMPLE_COORDINATES[temple.slug];
  if (hardcoded) {
    return hardcoded;
  }

  // 3. Try extracting from map_url
  const fromUrl = extractCoordsFromMapUrl(temple.acf?.map_url || "");
  if (fromUrl) {
    return fromUrl;
  }

  return null;
}

// ─── Batch calculate distances ────────────────────────────────────
function batchCalculateDistances(
  userLoc: UserLocation,
  temples: Temple[]
): DistanceMap {
  const distances: DistanceMap = {};

  temples.forEach((temple) => {
    const coords = getTempleCoords(temple);
    if (coords) {
      const dist = haversineDistance(
        userLoc.latitude,
        userLoc.longitude,
        coords.lat,
        coords.lng
      );
      distances[temple.id] = Math.round(dist * 10) / 10; // 1 decimal place
    } else {
      distances[temple.id] = null; // unknown
    }
  });

  return distances;
}

// ─── Cache helpers ────────────────────────────────────────────────
interface CachedDistances {
  distances: DistanceMap;
  timestamp: number;
  userLat: number;
  userLng: number;
}

async function loadCachedDistances(): Promise<CachedDistances | null> {
  try {
    const cached = await AsyncStorage.getItem(LOCATION_CONFIG.CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedDistances = JSON.parse(cached);
    const isExpired =
      Date.now() - parsed.timestamp > LOCATION_CONFIG.CACHE_TTL_MS;
    return isExpired ? null : parsed;
  } catch {
    return null;
  }
}

async function saveCachedDistances(
  distances: DistanceMap,
  userLoc: UserLocation
): Promise<void> {
  try {
    const data: CachedDistances = {
      distances,
      timestamp: Date.now(),
      userLat: userLoc.latitude,
      userLng: userLoc.longitude,
    };
    await AsyncStorage.setItem(
      LOCATION_CONFIG.CACHE_KEY,
      JSON.stringify(data)
    );
  } catch {
    // Silent fail — cache is not critical
  }
}

// ─── Main Hook ────────────────────────────────────────────────────
/**
 * Custom hook that provides:
 * - Real-time user location tracking
 * - Batch distance calculation for all temples
 * - Automatic recalculation on user movement
 * - Cached distances fallback
 *
 * Usage:
 *   const { distances, locationStatus } = useTempleDistances(temples);
 *   const dist = distances[temple.id]; // number | null
 */
export function useTempleDistances(temples: Temple[]) {
  const [distances, setDistances] = useState<DistanceMap>({});
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("loading");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const lastCalcLocation = useRef<UserLocation | null>(null);

  // ── Request permission + start watching ──
  useEffect(() => {
    let isMounted = true;

    const startTracking = async () => {
      try {
        // Load cached distances while we wait for GPS
        const cached = await loadCachedDistances();
        if (cached && isMounted) {
          setDistances(cached.distances);
        }

        // Request foreground permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (isMounted) setLocationStatus("denied");
          return;
        }

        if (isMounted) setLocationStatus("granted");

        // Get initial position quickly (low accuracy)
        try {
          const initial = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (isMounted) {
            setUserLocation({
              latitude: initial.coords.latitude,
              longitude: initial.coords.longitude,
            });
          }
        } catch {
          // Initial position failed, will rely on watch
        }

        // Start watching position
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: LOCATION_CONFIG.DISTANCE_INTERVAL_METERS,
            timeInterval: LOCATION_CONFIG.TIME_INTERVAL_MS,
          },
          (location) => {
            if (isMounted) {
              setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          }
        );

        watchRef.current = subscription;
      } catch (error) {
        console.warn("Location tracking error:", error);
        if (isMounted) setLocationStatus("unavailable");
      }
    };

    startTracking();

    return () => {
      isMounted = false;
      watchRef.current?.remove();
    };
  }, []);

  // ── Recalculate distances when user moves ──
  const recalculate = useCallback(() => {
    if (!userLocation || temples.length === 0) return;

    // Check if user moved enough to recalculate
    if (lastCalcLocation.current) {
      const movedKm = haversineDistance(
        lastCalcLocation.current.latitude,
        lastCalcLocation.current.longitude,
        userLocation.latitude,
        userLocation.longitude
      );
      // Skip if moved less than 50 meters
      if (movedKm < 0.05) return;
    }

    const newDistances = batchCalculateDistances(userLocation, temples);
    setDistances(newDistances);
    lastCalcLocation.current = userLocation;

    // Save to cache
    saveCachedDistances(newDistances, userLocation);
  }, [userLocation, temples]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  return {
    distances,
    locationStatus,
    userLocation,
    /** Force recalculate distances */
    refresh: recalculate,
  };
}

/**
 * Format distance for display.
 *   < 1 km → "800 m"
 *   >= 1 km → "2.3 km"
 *   null → null
 */
export function formatDistance(km: number | null | undefined): string | null {
  if (km === null || km === undefined) return null;
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
