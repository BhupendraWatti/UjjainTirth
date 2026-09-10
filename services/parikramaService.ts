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

export const DEFAULT_PARIKRAMA_DATA: NarmadaParikramaData = {
  modes: [
    {
      id: 5656,
      title: "Khand Parikrama",
      image: PARIKRAMA_MODE_FALLBACKS.khand,
      mode_type: "segmented",
      duration: "Flexible (7–14 Days)",
      distance: "Selected sections",
      short_description: "Perform sacred segments of Narmada Parikrama comfortably by vehicle and walking.",
    },
    {
      id: 5657,
      title: "Sampoorna Parikrama",
      image: PARIKRAMA_MODE_FALLBACKS.sampoorna,
      mode_type: "full parikrama",
      duration: "3 Years 3 Months / 15 Days by Bus",
      distance: "2,600+ km",
      short_description: "The complete, auspicious circumambulation of the holy mother Narmada from source to sea.",
    },
    {
      id: 5658,
      title: "Ghat to Ghat Darshan",
      image: PARIKRAMA_MODE_FALLBACKS.ghat,
      mode_type: "ghat to ghat",
      duration: "3–5 Days",
      distance: "Sacred Ghats Circuit",
      short_description: "Visit prominent holy ghats and sangams with guided rituals and aarti experiences.",
    },
  ],
  locations: [
    {
      id: 5655,
      title: "Amarkantak",
      image: LOCATION_FALLBACK_IMAGES.amarkantak,
      location_type: "origin",
      region: "Madhya Pradesh",
      short_description: "Origin of the sacred river Narmada in the Vindhya-Satpura ranges.",
      route_order: 1,
      is_featured: true,
      is_active: true,
    },
    {
      id: 5659,
      title: "Omkareshwar",
      image: LOCATION_FALLBACK_IMAGES.omkareshwar,
      location_type: "major stop",
      region: "Madhya Pradesh",
      short_description: "Holy island shaped like Om, home to the sacred Jyotirlinga and Narmada Sangam.",
      route_order: 2,
      is_featured: true,
      is_active: true,
    },
    {
      id: 5660,
      title: "Maheshwar",
      image: LOCATION_FALLBACK_IMAGES.maheshwar,
      location_type: "sacred ghat",
      region: "Madhya Pradesh",
      short_description: "Magnificent temple ghats built by Ahilyabai Holkar on the northern banks.",
      route_order: 3,
      is_featured: true,
      is_active: true,
    },
    {
      id: 5661,
      title: "Nemawar",
      image: LOCATION_FALLBACK_IMAGES.nemawar,
      location_type: "route point",
      region: "Madhya Pradesh",
      short_description: "The geographical navel (Nabhi) center of River Narmada with historic Siddheshwar temple.",
      route_order: 4,
      is_featured: false,
      is_active: true,
    },
    {
      id: 5662,
      title: "Bharuch (Narmada Sangam)",
      image: LOCATION_FALLBACK_IMAGES.bharuch,
      location_type: "important destination",
      region: "Gujarat",
      short_description: "Where Mother Narmada gracefully merges into the Arabian Sea at the sacred ocean sangam.",
      route_order: 5,
      is_featured: true,
      is_active: true,
    },
  ],
};

export const fetchParikramaData = async (): Promise<NarmadaParikramaData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const [modesRes, locationsRes] = await Promise.all([
      fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.PARIKRAMA_MODE}`, { headers: DEFAULT_HEADERS, signal: controller.signal }),
      fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.NARMADA_LOCATION}`, { headers: DEFAULT_HEADERS, signal: controller.signal }),
    ]);
    clearTimeout(timeoutId);

    if (!modesRes.ok || !locationsRes.ok) {
      console.warn("Parikrama endpoints returned non-ok, using fallback data");
      return DEFAULT_PARIKRAMA_DATA;
    }

    const [modesRaw, locationsRaw] = await Promise.all([
      modesRes.json(),
      locationsRes.json(),
    ]);

    const modes: ParikramaModeItem[] = (Array.isArray(modesRaw) && modesRaw.length > 0 ? modesRaw : DEFAULT_PARIKRAMA_DATA.modes).map((m: any) => {
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

    const locations: NarmadaLocationItem[] = (Array.isArray(locationsRaw) && locationsRaw.length > 0 ? locationsRaw : DEFAULT_PARIKRAMA_DATA.locations)
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
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Parikrama fetch error, using default parikrama data:", error);
    return DEFAULT_PARIKRAMA_DATA;
  }
};
