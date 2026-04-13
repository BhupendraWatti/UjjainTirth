/**
 * Location tracking configuration.
 * ─────────────────────────────────
 * Temple coordinates come directly from the API (acf.latitude / acf.longitude).
 * No hardcoded coordinates needed — every temple has lat/lng in the WordPress API.
 * Fallback: coordinates extracted from acf.map_url (Google Maps URL).
 */

export const LOCATION_CONFIG = {
  /** Minimum distance (meters) the user must move before recalculating */
  DISTANCE_INTERVAL_METERS: 50,

  /** Minimum time (ms) between location updates */
  TIME_INTERVAL_MS: 8_000, // 8 seconds

  /** How long cached distances are valid (ms) */
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes

  /** AsyncStorage key for cached distances */
  CACHE_KEY: "temple_distances_cache",
};
