/**
 * Base WordPress API URL
 * Change this once if the API location changes.
 */
export const API_BASE_URL = "https://ujjaintirth.com/wp-json/wp/v2";

export const API_CUSTOM_URL = "https://ujjaintirth.com/wp-json/custom/v1";
export const API_GRANTH_URL = "https://ujjaintirth.com/wp-json/granth/v1";

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
  JYOTIRLING_TOURS: "/jyotirling-tours",
  TRANSPORT_SERVICE: "/transport_service",
  POOJA: "/pooja",
  NARMADA_LOCATION: "/narmada_location",
  PARIKRAMA_MODE: "/parikrama_mode",
  // Granth OTP Auth endpoints
  SEND_OTP: "/auth/send-otp",
  RESEND_OTP: "/auth/resend-otp",
  VERIFY_OTP: "/auth/verify-otp",
  // Custom Dynamic OTP Screens
  OTP_SCREENS: "/otp-screens",
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
