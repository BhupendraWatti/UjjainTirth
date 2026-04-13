import { LOCATION_CONFIG } from "@/constants/templeCoordinates";
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
 * Great-circle distance between two GPS coordinates.
 * Returns distance in kilometers.
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371.0088; // Earth's mean radius in km
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat * 0.5) * Math.sin(dLat * 0.5) +
    Math.cos(lat1 * toRad) *
      Math.cos(lat2 * toRad) *
      Math.sin(dLon * 0.5) *
      Math.sin(dLon * 0.5);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Extract coordinates from Google Maps URL ─────────────────────
function extractCoordsFromMapUrl(
  mapUrl: string
): { lat: number; lng: number } | null {
  if (!mapUrl) return null;

  // Google Maps embeds destination coords as !2d<lng>!2d<lat> in the data path
  // or as @lat,lng in the URL. Try the most reliable patterns:

  // Pattern 1: !2d{lng}!2d{lat} — most reliable for destination
  const dataMatch = mapUrl.match(/!1d([\d.-]+)!2d([\d.-]+)/);
  if (dataMatch) {
    const lng = parseFloat(dataMatch[1]);
    const lat = parseFloat(dataMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }

  // Pattern 2: @lat,lng — common in Google Maps URLs
  const atMatch = mapUrl.match(/@([\d.-]+),([\d.-]+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }

  // Pattern 3: ?q=lat,lng
  const qMatch = mapUrl.match(/[?&]q=([\d.-]+),([\d.-]+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

// ─── Get temple coordinates from API data ─────────────────────────
/**
 * Coordinate resolution (2-tier — API first, map_url fallback):
 *   1. acf.latitude + acf.longitude from the WordPress API
 *   2. Extract from acf.map_url (Google Maps URL)
 */
export function getTempleCoords(
  temple: Temple
): { lat: number; lng: number } | null {
  // 1. API lat/lng — primary source (every temple should have this)
  const apiLat = parseFloat(temple.acf?.latitude || "");
  const apiLng = parseFloat(temple.acf?.longitude || "");
  if (!isNaN(apiLat) && !isNaN(apiLng) && apiLat !== 0 && apiLng !== 0) {
    return { lat: apiLat, lng: apiLng };
  }

  // 2. Fallback — extract from map_url
  return extractCoordsFromMapUrl(temple.acf?.map_url || "");
}

// ─── Batch calculate distances ────────────────────────────────────
function batchCalculateDistances(
  userLoc: UserLocation,
  temples: Temple[]
): DistanceMap {
  const distances: DistanceMap = {};

  for (let i = 0; i < temples.length; i++) {
    const temple = temples[i];
    const coords = getTempleCoords(temple);
    if (coords) {
      const dist = haversineDistance(
        userLoc.latitude,
        userLoc.longitude,
        coords.lat,
        coords.lng
      );
      // 2 decimal places for <10km, 1 decimal for ≥10km
      distances[temple.id] =
        dist < 10 ? Math.round(dist * 100) / 100 : Math.round(dist * 10) / 10;
    } else {
      distances[temple.id] = null;
    }
  }

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
    return Date.now() - parsed.timestamp > LOCATION_CONFIG.CACHE_TTL_MS
      ? null
      : parsed;
  } catch {
    return null;
  }
}

async function saveCachedDistances(
  distances: DistanceMap,
  userLoc: UserLocation
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      LOCATION_CONFIG.CACHE_KEY,
      JSON.stringify({
        distances,
        timestamp: Date.now(),
        userLat: userLoc.latitude,
        userLng: userLoc.longitude,
      } satisfies CachedDistances)
    );
  } catch {
    // Silent fail
  }
}

// ─── Main Hook ────────────────────────────────────────────────────
/**
 * Real-time temple distance tracking hook.
 *
 * How it works:
 * 1. Requests GPS permission
 * 2. Gets initial position (High accuracy)
 * 3. Watches for location changes (50m / 8s interval)
 * 4. On every GPS update → batch-calculates distance to ALL temples
 * 5. Caches results to AsyncStorage
 *
 * Coordinates come from the API (acf.latitude / acf.longitude).
 * Every temple in the WordPress backend has these fields populated.
 */
export function useTempleDistances(temples: Temple[]) {
  const [distances, setDistances] = useState<DistanceMap>({});
  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("loading");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const lastCalcRef = useRef<UserLocation | null>(null);
  const isFirstCalcRef = useRef(true);
  const templesRef = useRef(temples);
  templesRef.current = temples;

  // ── Request permission + start watching ──
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Load cache while waiting for GPS
        const cached = await loadCachedDistances();
        if (cached && mounted) {
          setDistances(cached.distances);
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (mounted) setLocationStatus("denied");
          return;
        }
        if (mounted) setLocationStatus("granted");

        // Get initial position with HIGH accuracy
        try {
          const initial = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          if (mounted) {
            setUserLocation({
              latitude: initial.coords.latitude,
              longitude: initial.coords.longitude,
            });
          }
        } catch {
          // Will rely on watch callback
        }

        // Watch position — recalculate on movement
        const sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: LOCATION_CONFIG.DISTANCE_INTERVAL_METERS,
            timeInterval: LOCATION_CONFIG.TIME_INTERVAL_MS,
          },
          (loc) => {
            if (mounted) {
              setUserLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });
            }
          }
        );

        watchRef.current = sub;
      } catch (err) {
        console.warn("[useTempleDistances] Error:", err);
        if (mounted) setLocationStatus("unavailable");
      }
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
    };
  }, []);

  // ── Recalculate distances when user location changes ──
  useEffect(() => {
    if (!userLocation || templesRef.current.length === 0) return;

    // Always calculate on first render (no skip)
    if (!isFirstCalcRef.current && lastCalcRef.current) {
      const movedKm = haversineDistance(
        lastCalcRef.current.latitude,
        lastCalcRef.current.longitude,
        userLocation.latitude,
        userLocation.longitude
      );
      // Skip if user hasn't moved at least 30 meters
      if (movedKm < 0.03) return;
    }

    isFirstCalcRef.current = false;
    const newDistances = batchCalculateDistances(
      userLocation,
      templesRef.current
    );
    setDistances(newDistances);
    lastCalcRef.current = userLocation;

    // Cache asynchronously (non-blocking)
    saveCachedDistances(newDistances, userLocation);
  }, [userLocation]);

  // ── Also recalculate if temples list changes (e.g. new page loaded) ──
  useEffect(() => {
    if (!userLocation || temples.length === 0) return;
    const newDistances = batchCalculateDistances(userLocation, temples);
    setDistances(newDistances);
  }, [temples.length]);

  const refresh = useCallback(() => {
    if (!userLocation) return;
    isFirstCalcRef.current = true;
    lastCalcRef.current = null;
    const newDistances = batchCalculateDistances(
      userLocation,
      templesRef.current
    );
    setDistances(newDistances);
  }, [userLocation]);

  return {
    distances,
    locationStatus,
    userLocation,
    refresh,
  };
}

/**
 * Format distance for display.
 *   < 1 km  → "800 m"
 *   1–10 km → "2.3 km"
 *   > 10 km → "15 km"
 */
export function formatDistance(km: number | null | undefined): string | null {
  if (km === null || km === undefined) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
