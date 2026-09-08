import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";
import { TransportServiceItem } from "@/types/transport";

export const TRANSPORT_FALLBACK_IMAGES: Record<string, string> = {
  mpv: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
  sedan: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=80",
  tempo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
};

export const getVehicleFallbackImage = (vehicleType: string = ""): string => {
  const v = vehicleType.toLowerCase();
  if (v.includes("mpv") || v.includes("innova") || v.includes("crysta")) {
    return TRANSPORT_FALLBACK_IMAGES.mpv;
  }
  if (v.includes("sedan") || v.includes("dzire") || v.includes("etios")) {
    return TRANSPORT_FALLBACK_IMAGES.sedan;
  }
  if (v.includes("tempo") || v.includes("traveller") || v.includes("urbania") || v.includes("bus")) {
    return TRANSPORT_FALLBACK_IMAGES.tempo;
  }
  return TRANSPORT_FALLBACK_IMAGES.default;
};

export const fetchTransportServices = async (): Promise<TransportServiceItem[]> => {
  const response = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.TRANSPORT_SERVICE}`, {
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transport services: ${response.status}`);
  }

  const data = await response.json();

  return (Array.isArray(data) ? data : []).map((item: any) => {
    const rawImage = typeof item.image === "string" ? item.image.trim() : "";
    const vehicleType = item.vehicle_type || "Premium MPV";
    const image = rawImage !== "" ? rawImage : getVehicleFallbackImage(vehicleType);

    const highlights = (Array.isArray(item.highlights) ? item.highlights : []).map((h: any) => ({
      icon: typeof h.icon === "string" && h.icon.trim() !== "" ? h.icon.trim() : "accessibility",
      label: typeof h.label === "string" ? h.label.trim() : "",
    }));

    return {
      id: Number(item.id) || 0,
      title: item.title || "Pilgrimage Cab Service",
      image,
      vehicle_type: vehicleType,
      passenger_capacity: Number(item.passenger_capacity) || 4,
      short_description: item.short_description || "",
      service_category: (item.service_category || "local").toLowerCase(),
      highlights,
      is_featured: Boolean(item.is_featured),
      is_recommended: Boolean(item.is_recommended),
    };
  });
};
