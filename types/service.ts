export interface Service {
  id: number;
  title: string;
  content: string;
  featured_image: string;

  acf: {
    service_name: string;
    service_short_dis: string;
    service_icon: string;
    service_list_image: string;
    service_detail_img: string;
  };
}

// ── Accommodation Detail Types ────────────────────────

export interface AccommodationHero {
  title: string;
  subtitle: string;
  image: string | null;
  cta: string;
}

export interface AccommodationHighlight {
  icon: string | null;
  label: string;
}

export interface HotelAmenity {
  name: string;
  description: string;
  featured: boolean;
}

export interface RoomTier {
  id: string;
  title: string;
  price: number;
  image?: string;
  size_sqft?: string;
  badge?: string;
  max_guests: number;
  beds: string;
  view?: string;
  amenity_highlights: string[];
}

export interface SacredRouteNode {
  id: string;
  title: string;
  tag?: string;
  distance_text: string;
  walk_time: string;
  description: string;
  icon: string;
  is_stay?: boolean;
}

export interface DevoteeReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  darshan_type?: string;
  comment: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number; // normalized 0–5
  thumbnail: string | null;
  gallery: string[];
  price: number;
  category: string;
  amenities: HotelAmenity[];
  // Extended Stitch Attributes (optional on raw API, provided by enrichment adapter)
  distance_to_mahakal?: string;
  walk_time?: string;
  distance_meters?: number;
  review_count?: number;
  property_badge?: string;
  about_text?: string;
  landmark_note?: string;
  bhasma_aarti_advantage?: string;
  rooms?: RoomTier[];
  nearby_shrines?: SacredRouteNode[];
  reviews?: DevoteeReview[];
}

export interface LinkedPackage {
  id: { ID: number; post_title: string };
  title: string;
}

export interface AccommodationData {
  type: string;
  title: string;
  tagline?: string;
  description?: string;
  hero: AccommodationHero;
  highlights: AccommodationHighlight[];
  hotels: Hotel[];
  linked_packages: LinkedPackage[];
}
