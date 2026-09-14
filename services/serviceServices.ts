import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";
import { AccommodationData, Service } from "@/types/service";

export const fetchService = async (): Promise<Service[]> => {
  const response = await fetch(
    `${API_CUSTOM_URL}${API_ENDPOINTS.SERVICES}?_embed`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }
  return response.json();
};

/**
 * Fetch accommodation service detail.
 * Normalizes: empty strings → null, rating / 2 (10-scale → 5-star).
 */
export const fetchAccommodation = async (): Promise<AccommodationData> => {
  const response = await fetch(
    `${API_CUSTOM_URL}${API_ENDPOINTS.SERVICE_DETAIL}/accommodation`,
    { headers: DEFAULT_HEADERS },
  );

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const raw = await response.json();

  // Normalize hero image
  const heroImage = raw.hero?.image && raw.hero.image.trim() !== ""
    ? raw.hero.image
    : null;

  // Normalize highlights icons
  const highlights = (raw.highlights || []).map((h: any) => ({
    icon: h.icon && h.icon.trim() !== "" ? h.icon : null,
    label: h.label || "",
  }));

  // Normalize hotels
  const hotels = (raw.hotels || []).map((h: any) => ({
    id: h.id || "",
    name: h.name || "",
    location: h.location || "",
    rating: Number(h.rating) > 5 ? Math.min(5, (Number(h.rating) || 0) / 2) : Math.min(5, Number(h.rating) || 4.8),
    thumbnail: h.thumbnail && h.thumbnail.trim() !== "" ? h.thumbnail : null,
    gallery: Array.isArray(h.gallery) ? h.gallery.filter((g: string) => g && g.trim() !== "") : [],
    price: Number(h.price) || 0,
    category: h.category || "",
    amenities: (h.amenities || []).map((a: any) => ({
      name: a.name || "",
      description: a.description || "",
      featured: Boolean(a.featured),
    })),
    // Dynamic fields populated by WordPress ACF / API
    distance_to_mahakal: h.distance_to_mahakal || "",
    walk_time: h.walk_time || "",
    distance_meters: h.distance_meters ? Number(h.distance_meters) : undefined,
    property_badge: h.property_badge || "",
    about_text: h.about_text || h.description || "",
    landmark_note: h.landmark_note || "",
    bhasma_aarti_advantage: h.bhasma_aarti_advantage || "",
    rooms: Array.isArray(h.rooms)
      ? h.rooms.map((r: any) => ({
          id: r.id || String(r.title || ""),
          title: r.title || "",
          price: Number(r.price) || Number(h.price) || 0,
          image: r.image || null,
          size_sqft: r.size_sqft || "",
          badge: r.badge || "",
          max_guests: Number(r.max_guests) || 2,
          beds: r.beds || "",
          view: r.view || "",
          amenity_highlights: typeof r.amenity_highlights === "string"
            ? r.amenity_highlights.split(",").map((s: string) => s.trim()).filter(Boolean)
            : Array.isArray(r.amenity_highlights)
            ? r.amenity_highlights
            : [],
        }))
      : [],
    nearby_shrines: Array.isArray(h.nearby_shrines)
      ? h.nearby_shrines.map((s: any) => ({
          id: s.id || String(s.title || ""),
          title: s.title || "",
          tag: s.tag || "",
          distance_text: s.distance_text || "",
          walk_time: s.walk_time || "",
          description: s.description || "",
          icon: s.icon || "temple-hindu",
          is_stay: Boolean(s.is_stay),
        }))
      : [],
  }));

  // Normalize linked packages
  const linked_packages = (raw.linked_packages || []).map((p: any) => ({
    id: p.id || {},
    title: p.title || "",
  }));

  return {
    type: raw.type || "accommodation",
    title: raw.title || "Accommodation",
    tagline: raw.tagline || "",
    description: raw.description || "",
    hero: {
      title: raw.hero?.title || "",
      subtitle: raw.hero?.subtitle || "",
      image: heroImage,
      cta: raw.hero?.cta || "",
    },
    highlights,
    hotels,
    linked_packages,
  };
};
