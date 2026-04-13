import { API_CUSTOM_URL, API_ENDPOINTS } from "@/constants/api";
import { Package } from "@/types/product";

/**
 * Fetch all packages (list view - basic fields only)
 */
export const fetchPackages = async (): Promise<Package[]> => {
  try {
    const response = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.PACKAGES}`);
    if (!response.ok) {
      throw new Error("Failed to fetch packages");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API ERROR (fetchPackages):", error);
    throw error;
  }
};

/**
 * Fetch full package details by ID (includes package_details & additional_info)
 * The API uses ?id=<packageId> query param to return the full list filtered,
 * but the response is always an array — we pick the matching one.
 */
export const fetchPackageById = async (
  id: number
): Promise<Package | null> => {
  try {
    const response = await fetch(
      `${API_CUSTOM_URL}${API_ENDPOINTS.PACKAGES}?id=${id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch package ${id}`);
    }

    const data: Package[] = await response.json();

    // The API returns all packages with full details when ?id= is used
    // Find the one matching our ID
    const found = data.find((pkg) => pkg.id === id);
    return found || null;
  } catch (error) {
    console.error("API ERROR (fetchPackageById):", error);
    throw error;
  }
};
