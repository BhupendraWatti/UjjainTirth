/**
 * Hardcoded coordinates for Ujjain temples.
 * ──────────────────────────────────────────
 * Key = temple slug (must match the API slug exactly).
 * Used as fallback when the API doesn't return lat/lng.
 *
 * To add a new temple, just add a new entry:
 *   "temple-slug": { lat: xx.xxx, lng: yy.yyy },
 */
export const TEMPLE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "mahakaleshwar-temple-2": { lat: 23.1829, lng: 75.7682 },
  "bade-ganeshji-temple": { lat: 23.1837, lng: 75.7649 },
  "harsiddhi-temple": { lat: 23.1821, lng: 75.7674 },
  "char-dham-temple": { lat: 23.1812, lng: 75.7698 },
  "ramghat-shipra-river": { lat: 23.1813, lng: 75.7619 },
  "sandipani-ashram": { lat: 23.1726, lng: 75.7796 },
  "mangalnath-temple": { lat: 23.1954, lng: 75.7527 },
  "kal-bhairava-temple": { lat: 23.1701, lng: 75.7353 },
  "gadkalika-temple": { lat: 23.1667, lng: 75.7354 },
  "bhartrihari-cave": { lat: 23.2053, lng: 75.7563 },
  "siddhvat-temple": { lat: 23.1742, lng: 75.7567 },
  "jantar-mantar-vedhshala": { lat: 23.1793, lng: 75.7685 },
  "gopal-temple": { lat: 23.1806, lng: 75.7613 },
  "chintaman-ganesh": { lat: 23.1683, lng: 75.7978 },
  "pir-matsyendranath": { lat: 23.1781, lng: 75.7636 },
  "vikram-kirti-mandir": { lat: 23.1789, lng: 75.7687 },
  "kaliadeh-palace": { lat: 23.2178, lng: 75.7494 },
  "navgraha-temple": { lat: 23.1869, lng: 75.7629 },
  "navagraha-mandir": { lat: 23.1869, lng: 75.7629 },
};

/**
 * Location tracking config
 */
export const LOCATION_CONFIG = {
  /** Minimum distance (meters) the user must move before recalculating */
  DISTANCE_INTERVAL_METERS: 100,

  /** Minimum time (ms) between location updates */
  TIME_INTERVAL_MS: 10_000, // 10 seconds

  /** How long cached distances are valid (ms) */
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes

  /** AsyncStorage key for cached distances */
  CACHE_KEY: "temple_distances_cache",
};
