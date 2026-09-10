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

export const DEFAULT_TRANSPORT_SERVICES: TransportServiceItem[] = [
  {
    id: 5653,
    title: "Kripa Innova Crysta",
    image: TRANSPORT_FALLBACK_IMAGES.mpv,
    vehicle_type: "Premium MPV",
    passenger_capacity: 6,
    short_description: "Spacious and comfortable premium MPV perfect for family pilgrimage and outstation tours.",
    service_category: "group",
    highlights: [
      { icon: "accessibility", label: "Elder Step Available" },
      { icon: "seats", label: "6 Air-conditioned Seats" },
      { icon: "luggage", label: "Spacious Luggage Boot" },
    ],
    is_featured: true,
    is_recommended: true,
  },
  {
    id: 5654,
    title: "Swift Dzire / Etios",
    image: TRANSPORT_FALLBACK_IMAGES.sedan,
    vehicle_type: "Sedan",
    passenger_capacity: 4,
    short_description: "Budget-friendly, air-conditioned sedan ideal for couple and small family local darshan.",
    service_category: "local",
    highlights: [
      { icon: "ac", label: "Climate Control" },
      { icon: "seats", label: "4 Comfortable Seats" },
      { icon: "driver", label: "Experienced Driver" },
    ],
    is_featured: false,
    is_recommended: true,
  },
  {
    id: 5655,
    title: "Force Urbania / Tempo Traveller",
    image: TRANSPORT_FALLBACK_IMAGES.tempo,
    vehicle_type: "Tempo Traveller",
    passenger_capacity: 12,
    short_description: "Luxury group yatra vehicle equipped with pushback seats for Omkareshwar and outstation.",
    service_category: "group",
    highlights: [
      { icon: "seats", label: "12-16 Pushback Seats" },
      { icon: "ac", label: "Dual AC Cooling" },
      { icon: "luggage", label: "Ample Luggage Space" },
    ],
    is_featured: true,
    is_recommended: false,
  },
];

export const fetchTransportServices = async (): Promise<TransportServiceItem[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.TRANSPORT_SERVICE}`, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Transport API returned status ${response.status}, using default data`);
      return DEFAULT_TRANSPORT_SERVICES;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return DEFAULT_TRANSPORT_SERVICES;
    }

    return data.map((item: any) => {
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
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Transport fetch error, using default transport services:", error);
    return DEFAULT_TRANSPORT_SERVICES;
  }
};
