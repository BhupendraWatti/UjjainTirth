import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";

export interface OtpScreenItem {
  id: number;
  slug: string;
  title: string;
  post_title: string;
  image_url: string;
  image_id?: number;
  fields?: {
    title?: string;
    image?: string;
  };
}

export interface OtpScreensApiResponse {
  success: boolean;
  screens: OtpScreenItem[];
}

export interface DynamicOtpScreensData {
  screen1ImageUrl: string;
  screen2ImageUrl: string;
  screen2PanoramaUrl: string;
  screen2LeftMandalaUrl: string;
  screen2RightMandalaUrl: string;
  screen2CenterOhmUrl: string;
  /** Single full-circle chakra/mandala image (Post ID 5684) for OTP screen watermark */
  screen2CenterChakraUrl: string;
  screens: OtpScreenItem[];
}

// Fallback images (from WordPress uploads) so UI renders immediately even offline
const DEFAULT_SCREEN_1_IMAGE =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Ujjain-sacred-skyline-1.png";
const DEFAULT_SCREEN_2_PANORAMA =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Saffron-Temple-City-Panorama-1.png";
const DEFAULT_SCREEN_2_LEFT_MANDALA =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Glowing-Golden-Mandala-Half-on-Transparency-1.png";
const DEFAULT_SCREEN_2_RIGHT_MANDALA =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Luminous-Half-Mandala-Ornament-1.png";
const DEFAULT_SCREEN_2_CENTER_OHM =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Ohm-image-1.png";
// Single full-circle mandala chakra (Post ID 5684) — primary watermark on OTP screen
const DEFAULT_SCREEN_2_CENTER_CHAKRA =
  "https://ujjaintirth.com/wp-content/uploads/2026/09/Golden-Om-Mandala-Medallion-1.png";

let cachedScreensData: DynamicOtpScreensData | null = null;

/**
 * Fetch dynamic OTP screens data from WordPress custom endpoint:
 * https://ujjaintirth.com/wp-json/custom/v1/otp-screens
 *
 * Resolves:
 * - Screen 1 (ID 5675): Login hero artwork
 * - Screen 2 Panorama (ID 5676): Saffron Temple City Panorama
 * - Screen 2 Left Mandala (ID 5678): Glowing Golden Mandala Half
 * - Screen 2 Right Mandala (ID 5680): Luminous Half Mandala Ornament
 * - Screen 2 Center Ohm (ID 5682): 3D Golden Sacred Ohm
 * - Screen 2 Center Chakra (ID 5684): Golden Om Mandala Medallion (full circle watermark)
 */
export async function fetchOtpScreens(): Promise<DynamicOtpScreensData> {
  if (cachedScreensData) {
    return cachedScreensData;
  }

  try {
    const url = `${API_CUSTOM_URL}${API_ENDPOINTS.OTP_SCREENS}`;
    const response = await fetch(url, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (response.ok) {
      const data: OtpScreensApiResponse = await response.json();
      if (data && data.success && Array.isArray(data.screens)) {
        // Screen 1: Matches ID 5675 or title/slug
        const screen1 = data.screens.find(
          (s) =>
            s.id === 5675 ||
            s.slug?.toLowerCase().includes("otp-phone") ||
            s.title?.toLowerCase().includes("screen 1") ||
            s.post_title?.toLowerCase().includes("phone")
        );

        // Screen 2 Panorama: Matches ID 5676 or title/slug
        const screen2 = data.screens.find(
          (s) =>
            s.id === 5676 ||
            s.slug?.toLowerCase().includes("saffron") ||
            s.title?.toLowerCase().includes("screen 2") ||
            s.post_title?.toLowerCase().includes("saffron")
        );

        // Screen 2 Left Mandala: Matches ID 5678 or slug/title
        const leftMandala = data.screens.find(
          (s) =>
            s.id === 5678 ||
            s.slug?.toLowerCase().includes("left") ||
            s.title?.toLowerCase().includes("left") ||
            s.post_title?.toLowerCase().includes("left")
        );

        // Screen 2 Right Mandala: Matches ID 5680 or slug/title
        const rightMandala = data.screens.find(
          (s) =>
            s.id === 5680 ||
            s.slug?.toLowerCase().includes("right") ||
            s.title?.toLowerCase().includes("right") ||
            s.post_title?.toLowerCase().includes("right")
        );

        // Screen 2 Center Ohm: Matches ID 5682 or slug/title
        const centerOhm = data.screens.find(
          (s) =>
            s.id === 5682 ||
            s.slug?.toLowerCase().includes("omh") ||
            s.slug?.toLowerCase().includes("ohm") ||
            s.title?.toLowerCase().includes("omh") ||
            s.title?.toLowerCase().includes("ohm") ||
            s.post_title?.toLowerCase().includes("omh") ||
            s.post_title?.toLowerCase().includes("ohm")
        );

        const screen1Url =
          screen1?.image_url ||
          screen1?.fields?.image ||
          DEFAULT_SCREEN_1_IMAGE;

        const screen2Url =
          screen2?.image_url ||
          screen2?.fields?.image ||
          DEFAULT_SCREEN_2_PANORAMA;

        const leftMandalaUrl =
          leftMandala?.image_url ||
          leftMandala?.fields?.image ||
          DEFAULT_SCREEN_2_LEFT_MANDALA;

        const rightMandalaUrl =
          rightMandala?.image_url ||
          rightMandala?.fields?.image ||
          DEFAULT_SCREEN_2_RIGHT_MANDALA;

        const centerOhmUrl =
          centerOhm?.image_url ||
          centerOhm?.fields?.image ||
          DEFAULT_SCREEN_2_CENTER_OHM;

        // Screen 2 Center Chakra: Full-circle mandala (ID 5684)
        const centerChakra = data.screens.find(
          (s) =>
            s.id === 5684 ||
            s.slug?.toLowerCase().includes("chakar") ||
            s.slug?.toLowerCase().includes("chakra") ||
            s.slug?.toLowerCase().includes("medallion") ||
            s.title?.toLowerCase().includes("chakar") ||
            s.title?.toLowerCase().includes("chakra") ||
            s.post_title?.toLowerCase().includes("chakar") ||
            s.post_title?.toLowerCase().includes("centered")
        );

        const centerChakraUrl =
          centerChakra?.image_url ||
          centerChakra?.fields?.image ||
          DEFAULT_SCREEN_2_CENTER_CHAKRA;

        const resolved: DynamicOtpScreensData = {
          screen1ImageUrl: screen1Url,
          screen2ImageUrl: screen2Url,
          screen2PanoramaUrl: screen2Url,
          screen2LeftMandalaUrl: leftMandalaUrl,
          screen2RightMandalaUrl: rightMandalaUrl,
          screen2CenterOhmUrl: centerOhmUrl,
          screen2CenterChakraUrl: centerChakraUrl,
          screens: data.screens,
        };

        cachedScreensData = resolved;
        return resolved;
      }
    }
  } catch (error) {
    console.warn("[otpScreenService] Error fetching dynamic OTP screens:", error);
  }

  // Graceful fallback if offline or request failed
  return {
    screen1ImageUrl: DEFAULT_SCREEN_1_IMAGE,
    screen2ImageUrl: DEFAULT_SCREEN_2_PANORAMA,
    screen2PanoramaUrl: DEFAULT_SCREEN_2_PANORAMA,
    screen2LeftMandalaUrl: DEFAULT_SCREEN_2_LEFT_MANDALA,
    screen2RightMandalaUrl: DEFAULT_SCREEN_2_RIGHT_MANDALA,
    screen2CenterOhmUrl: DEFAULT_SCREEN_2_CENTER_OHM,
    screen2CenterChakraUrl: DEFAULT_SCREEN_2_CENTER_CHAKRA,
    screens: [],
  };
}
