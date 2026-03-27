import { API_CUSTOM_URL, API_ENDPOINTS } from "@/constants/api";
import { OnboardingItem } from "@/types/onboarding";

export const fetchOnboarding = async (): Promise<OnboardingItem[]> => {
  const res = await fetch(`${API_CUSTOM_URL}${API_ENDPOINTS.ONBOARDING}`);

  return res.json();
};
