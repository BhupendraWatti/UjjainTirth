import {
  API_CUSTOM_URL,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  PAGINATION,
} from "@/constants/api";
import { JyotirlingTour, PaginatedJyotirlingTourResponse } from "@/types/jyotirlingTour";

interface FetchJyotirlingToursParams {
  page?: number;
  search?: string;
  locationTag?: string;
}

const tourCache = new Map<string, JyotirlingTour>();

/**
 * Fetch jyotirling tours list (paginated)
 */
export const fetchJyotirlingTours = async ({
  page = 1,
  search,
  locationTag,
}: FetchJyotirlingToursParams = {}): Promise<PaginatedJyotirlingTourResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("per_page", PAGINATION.PAGE_SIZE.toString());

    if (search && search.trim() !== "") {
      params.append("search", search);
    }

    if (locationTag && locationTag.trim() !== "") {
      params.append("location_tag", locationTag);
    }

    // Force refresh cache
    params.append("nocache", Date.now().toString());

    const url = `${API_CUSTOM_URL}${API_ENDPOINTS.JYOTIRLING_TOURS}?${params.toString()}`;

    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 400) {
        return {
          data: [],
          totalPages: page - 1,
        };
      }
      console.warn(`Jyotirling tours API error: ${response.status}`);
      return { data: [], totalPages: 1 };
    }

    const totalPages = Number(response.headers.get("X-WP-TotalPages") || 1);
    const data: JyotirlingTour[] = await response.json();

    return { data: Array.isArray(data) ? data : [], totalPages };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("Jyotirling tours fetch failed, using fallback tours:", error);
    return { data: [], totalPages: 1 };
  }
};

/**
 * Fetch a single jyotirling tour by slug
 */
export const fetchJyotirlingTourBySlug = async (
  slug: string
): Promise<JyotirlingTour | null> => {
  if (tourCache.has(slug)) {
    return tourCache.get(slug)!;
  }

  try {
    const params = new URLSearchParams();
    params.append("slug", slug);

    const url = `${API_CUSTOM_URL}${API_ENDPOINTS.JYOTIRLING_TOURS}?${params.toString()}`;

    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: JyotirlingTour[] = await response.json();
    const tour = data?.find((t) => t.slug === slug) || null;

    if (tour) {
      tourCache.set(slug, tour);
    }

    return tour;
  } catch (error) {
    console.error("fetchJyotirlingTourBySlug failed:", error);
    return null;
  }
};
