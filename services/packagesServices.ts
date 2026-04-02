// import { API_CUSTOM_URL, API_ENDPOINTS } from "@/constants/api";
// import { Package } from "@/types/product";
// // const BASE_URL = "https://ujjaintirth.com/wp-json/custom/v1";

// export const fetchPackages = async (): Promise<Package[]> => {
//   try {
//     const response = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.PACKAGES}`);
//     console.log("URL:", response);
//     if (!response.ok) {
//       throw new Error("Failed to fetch packages");
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("API ERROR:", error);
//     throw error;
//   }
// };
