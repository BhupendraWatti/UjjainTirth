import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_CUSTOM_URL,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
} from "@/constants/api";

const SHARE_CACHE_KEY = "share_content_cache";

export interface ShareContentData {
  title: string;
  description: string;
  link: string;
  cta: string;
  image?: string; // Image URL from API
}

interface ShareAppResponse {
  success: boolean;
  data: ShareContentData;
}

/**
 * Cache share content to AsyncStorage
 */
export const cacheShareContent = async (data: ShareContentData): Promise<void> => {
  try {
    await AsyncStorage.setItem(SHARE_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("cacheShareContent failed:", error);
  }
};

/**
 * Load cached share content
 */
export const getCachedShareContent = async (): Promise<ShareContentData | null> => {
  try {
    const cached = await AsyncStorage.getItem(SHARE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("getCachedShareContent failed:", error);
    return null;
  }
};

export const fetchShareContent = async (): Promise<ShareContentData> => {
  try {
    const url = `${API_CUSTOM_URL}${API_ENDPOINTS.SHARE_APP}`;
    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result: ShareAppResponse = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("fetchShareContent failed:", error);
    throw error;
  }
};

export const buildShareMessage = (data: ShareContentData): string => {
  return `${data.title}\n\n${data.description}\n\n${data.cta}\n${data.link}`;
};

export const getShareImageUrl = (data: ShareContentData): string | null => {
  return data.image ?? null;
};
