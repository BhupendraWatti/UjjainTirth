import { Hotel, RoomTier, SacredRouteNode } from "@/types/service";

export interface EnrichedHotel extends Hotel {
  distance_to_mahakal: string;
  walk_time: string;
  distance_meters: number;
  property_badge: string;
  about_text: string;
  landmark_note: string;
  bhasma_aarti_advantage: string;
  rooms: RoomTier[];
  nearby_shrines: SacredRouteNode[];
}

/**
 * Adapter that formats and provides safe access to dynamic hotel fields coming from the API.
 * No static or hardcoded dummy content is injected; fields reflect actual API data.
 */
export function enrichHotel(hotel: Hotel): EnrichedHotel {
  const categoryLabel = hotel.category
    ? hotel.category.charAt(0).toUpperCase() + hotel.category.slice(1)
    : "";

  return {
    ...hotel,
    distance_to_mahakal: hotel.distance_to_mahakal || "",
    walk_time: hotel.walk_time || "",
    distance_meters: hotel.distance_meters || 0,
    property_badge: hotel.property_badge || categoryLabel,
    about_text: hotel.about_text || "",
    landmark_note: hotel.landmark_note || "",
    bhasma_aarti_advantage: hotel.bhasma_aarti_advantage || "",
    rooms: Array.isArray(hotel.rooms) ? hotel.rooms : [],
    nearby_shrines: Array.isArray(hotel.nearby_shrines) ? hotel.nearby_shrines : [],
  };
}

/** Function line to get room tiers from API payload */
export function getHotelRooms(hotel: Hotel | null | undefined): RoomTier[] {
  if (!hotel || !Array.isArray(hotel.rooms)) return [];
  return hotel.rooms;
}

/** Function line to get nearby shrines / walking route from API payload */
export function getHotelNearbyShrines(hotel: Hotel | null | undefined): SacredRouteNode[] {
  if (!hotel || !Array.isArray(hotel.nearby_shrines)) return [];
  return hotel.nearby_shrines;
}

/** Function line to get editorial about text from API payload */
export function getHotelAboutText(hotel: Hotel | null | undefined): string {
  return hotel?.about_text ? hotel.about_text.trim() : "";
}

/** Function line to check if proximity fields exist in API payload */
export function hasProximityData(hotel: Hotel | null | undefined): boolean {
  if (!hotel) return false;
  return Boolean(
    (hotel.distance_to_mahakal && hotel.distance_to_mahakal.trim() !== "") ||
    (hotel.walk_time && hotel.walk_time.trim() !== "") ||
    (hotel.bhasma_aarti_advantage && hotel.bhasma_aarti_advantage.trim() !== "") ||
    (hotel.landmark_note && hotel.landmark_note.trim() !== "")
  );
}

/** Function line to get distance to Mahakal from API payload */
export function getHotelDistanceText(hotel: Hotel | null | undefined): string {
  if (!hotel?.distance_to_mahakal) return "";
  const parts = [hotel.distance_to_mahakal];
  if (hotel.walk_time) parts.push(hotel.walk_time);
  return parts.join(" · ");
}
