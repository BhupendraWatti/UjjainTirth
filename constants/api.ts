/**
 * Base WordPress API URL
 * Change this once if the API location changes.
 */
export const API_BASE_URL = 'https://ujjaintirth.com/wp-json/wp/v2'; 


/**
 * API endpoints used across the app
 */
export const API_ENDPOINTS = {
  TEMPLES: '/temples',
  CATEGORIES: '/temple_category',
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
  Accept: 'application/json',
  'Content-Type': 'application/json',
};