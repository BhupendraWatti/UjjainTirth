export interface Service {
  id: number;
  title: string;
  content: string;
  featured_image: string;
  type?: string;

  acf_legacy: {
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
}

export interface LinkedPackage {
  id: { ID: number; post_title: string };
  title: string;
}

export interface AccommodationData {
  type: string;
  title: string;
  hero: AccommodationHero;
  highlights: AccommodationHighlight[];
  hotels: Hotel[];
  linked_packages: LinkedPackage[];
}
