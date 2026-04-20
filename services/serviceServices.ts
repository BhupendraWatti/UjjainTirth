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
    rating: Math.min(5, Math.max(0, (Number(h.rating) || 0) / 2)),
    thumbnail: h.thumbnail && h.thumbnail.trim() !== "" ? h.thumbnail : null,
    gallery: Array.isArray(h.gallery) ? h.gallery.filter((g: string) => g && g.trim() !== "") : [],
    price: Number(h.price) || 0,
    category: h.category || "",
    amenities: (h.amenities || []).map((a: any) => ({
      name: a.name || "",
      description: a.description || "",
      featured: Boolean(a.featured),
    })),
  }));

  // Normalize linked packages
  const linked_packages = (raw.linked_packages || []).map((p: any) => ({
    id: p.id || {},
    title: p.title || "",
  }));

  return {
    type: raw.type || "accommodation",
    title: raw.title || "Accommodation",
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
