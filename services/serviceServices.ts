import { API_CUSTOM_URL, API_ENDPOINTS } from "@/constants/api";
import { Service } from "@/types/service";
export const fetchService = async (): Promise<Service[]> => {
  const response = await fetch(
    `${API_CUSTOM_URL}${API_ENDPOINTS.SERVICES}?_embed`,
  );

  if (!response.ok) {
    throw new Error("Faild to fetch API");
  }
  return response.json();
};
