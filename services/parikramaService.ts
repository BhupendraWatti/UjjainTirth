import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";
import { NarmadaLocationItem, NarmadaParikramaData, ParikramaModeItem } from "@/types/parikrama";

export const LOCATION_FALLBACK_IMAGES: Record<string, string> = {
  amarkantak: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
  omkareshwar: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
  maheshwar: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
  nemawar: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  bharuch: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
};

export const getLocationFallbackImage = (title: string = "", type: string = ""): string => {
  const t = title.toLowerCase();
  if (t.includes("amarkantak")) return LOCATION_FALLBACK_IMAGES.amarkantak;
  if (t.includes("omkareshwar") || t.includes("mamleshwar")) return LOCATION_FALLBACK_IMAGES.omkareshwar;
  if (t.includes("maheshwar")) return LOCATION_FALLBACK_IMAGES.maheshwar;
  if (t.includes("nemawar")) return LOCATION_FALLBACK_IMAGES.nemawar;
  if (t.includes("bharuch") || t.includes("sangam")) return LOCATION_FALLBACK_IMAGES.bharuch;
  return LOCATION_FALLBACK_IMAGES.default;
};

export const PARIKRAMA_MODE_FALLBACKS: Record<string, string> = {
  khand: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
  sampoorna: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
  ghat: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80",
};

export const fetchParikramaData = async (): Promise<NarmadaParikramaData> => {
  const [modesRes, locationsRes] = await Promise.all([
    fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.PARIKRAMA_MODE}`, { headers: DEFAULT_HEADERS }),
    fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.NARMADA_LOCATION}`, { headers: DEFAULT_HEADERS }),
  ]);

  if (!modesRes.ok || !locationsRes.ok) {
    throw new Error(`Failed to fetch Parikrama data: modes=${modesRes.status}, locations=${locationsRes.status}`);
  }

  const [modesRaw, locationsRaw] = await Promise.all([
    modesRes.json(),
    locationsRes.json(),
  ]);

  const modes: ParikramaModeItem[] = (Array.isArray(modesRaw) ? modesRaw : []).map((m: any) => {
    const rawImage = typeof m.image === "string" ? m.image.trim() : "";
    let fallback = PARIKRAMA_MODE_FALLBACKS.khand;
    const title = (m.title || "").toLowerCase();
    if (title.includes("sampoorna")) fallback = PARIKRAMA_MODE_FALLBACKS.sampoorna;
    else if (title.includes("ghat")) fallback = PARIKRAMA_MODE_FALLBACKS.ghat;

    return {
      id: Number(m.id) || 0,
      title: m.title || "Narmada Parikrama Yatra",
      image: rawImage !== "" ? rawImage : fallback,
      mode_type: (m.mode_type || "segmented").toLowerCase(),
      duration: m.duration || "Flexible",
      distance: m.distance || "Sacred Circuit",
      short_description: m.short_description || "",
    };
  });

  const locations: NarmadaLocationItem[] = (Array.isArray(locationsRaw) ? locationsRaw : [])
    .map((l: any) => {
      const rawImage = typeof l.image === "string" ? l.image.trim() : "";
      const locationType = (l.location_type || "route point").toLowerCase();
      const image = rawImage !== "" ? rawImage : getLocationFallbackImage(l.title, locationType);

      return {
        id: Number(l.id) || 0,
        title: l.title || "Holy River Stop",
        image,
        location_type: locationType,
        region: l.region || "Madhya Pradesh",
        short_description: l.short_description || "",
        route_order: Number(l.route_order) || 1,
        is_featured: Boolean(l.is_featured),
        is_active: l.is_active !== undefined ? Boolean(l.is_active) : true,
      };
    })
    .sort((a, b) => a.route_order - b.route_order);

  return {
    modes,
    locations,
  };
};
