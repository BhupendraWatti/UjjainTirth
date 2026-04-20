/**
 * Base WordPress API URL
 * Change this once if the API location changes.
 */
export const API_BASE_URL = "https://ujjaintirth.com/wp-json/wp/v2";

export const API_CUSTOM_URL = "https://ujjaintirth.com/wp-json/custom/v1";
/**
 * API endpoints used across the app
 */
export const API_ENDPOINTS = {
  TEMPLES: "/temples",
  CATEGORIES: "/temple_category",
  SERVICES: "/services",
  SERVICE_DETAIL: "/service",
  ONBOARDING: "/onboarding",
  PACKAGES: "/packages",
  SHARE_APP: "/share-app",
};

/**
 * Pagination configuration
 */
export const PAGINATION = {
  PAGE_SIZE: 10,
};

/**
 * Default headers for API requests
 */
export const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
