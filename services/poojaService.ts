import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";
import { PoojaItem } from "@/types/pooja";

export const POOJA_FALLBACK_IMAGES: Record<string, string> = {
  shiva: "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80",
  special: "https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?w=800&auto=format&fit=crop&q=80",
  protection: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
  prosperity: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1609358905581-e5382c23f2f8?w=800&auto=format&fit=crop&q=80",
};

export const getPoojaFallbackImage = (category: string = ""): string => {
  const c = category.toLowerCase();
  if (c.includes("shiva") || c.includes("rudra")) {
    return POOJA_FALLBACK_IMAGES.shiva;
  }
  if (c.includes("mangal") || c.includes("special") || c.includes("bhat")) {
    return POOJA_FALLBACK_IMAGES.special;
  }
  if (c.includes("protect") || c.includes("bhairav") || c.includes("kaal")) {
    return POOJA_FALLBACK_IMAGES.protection;
  }
  if (c.includes("prosperity") || c.includes("devi") || c.includes("lakshmi")) {
    return POOJA_FALLBACK_IMAGES.prosperity;
  }
  return POOJA_FALLBACK_IMAGES.default;
};

export const fetchPoojas = async (): Promise<PoojaItem[]> => {
  const response = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.POOJA}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch poojas: ${response.status}`);
  }

  const data = await response.json();

  return (Array.isArray(data) ? data : []).map((item: any) => {
    const rawImage = typeof item.image === "string" ? item.image.trim() : "";
    const category = (item.category || "shiva").toLowerCase();
    const image = rawImage !== "" ? rawImage : getPoojaFallbackImage(category);

    return {
      id: Number(item.id) || 0,
      title: item.title || "Vedic Ritual",
      image,
      temple: item.temple || "Mahakaleshwar Temple",
      category,
      duration: item.duration || "45–60 min",
      short_purpose: item.short_purpose || "",
      starting_price: item.starting_price !== null && item.starting_price !== undefined ? Number(item.starting_price) : null,
      is_featured: Boolean(item.is_featured),
    };
  });
};
