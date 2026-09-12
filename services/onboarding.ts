import { API_CUSTOM_URL, API_ENDPOINTS, DEFAULT_HEADERS } from "@/constants/api";
import { OnboardingItem } from "@/types/onboarding";

export const DEFAULT_ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    id: 4587,
    title: "Welcome to UjjainTirth",
    description:
      "Discover temples, rituals, and sacred experiences in the holy city of Lord Shiva.",
    image: "https://ujjaintirth.com/wp-content/uploads/2026/03/1.png",
  },
  {
    id: 4588,
    title: "Book Puja with Ease",
    description:
      "Schedule rituals, book darshan, and plan your spiritual journey in just a few taps.",
    image: "https://ujjaintirth.com/wp-content/uploads/2026/03/2.jpeg",
  },
  {
    id: 4589,
    title: "Comfortable Stay Near Temple",
    description:
      "Book verified hotels and guest houses near Mahakaleshwar Temple for a peaceful stay.",
    image: "https://ujjaintirth.com/wp-content/uploads/2026/03/3.png",
  },
];

export const fetchOnboarding = async (): Promise<OnboardingItem[]> => {
  try {
    const url = `${API_CUSTOM_URL}${API_ENDPOINTS.ONBOARDING}`;
    const res = await fetch(url, {
      method: "GET",
      headers: DEFAULT_HEADERS,
    });

    if (!res.ok) {
      console.warn(`[Onboarding] Server responded with status ${res.status}`);
      return DEFAULT_ONBOARDING_ITEMS;
    }

    const rawData = await res.json();
    if (Array.isArray(rawData) && rawData.length > 0) {
      const sanitized = rawData
        .filter(
          (item: any) =>
            item &&
            typeof item === "object" &&
            item.description &&
            typeof item.description === "string" &&
            item.description.trim().length > 0 &&
            !item.title?.toLowerCase().includes("screen one otp")
        )
        .map((item: any, idx: number) => {
          const fallback =
            DEFAULT_ONBOARDING_ITEMS[idx % DEFAULT_ONBOARDING_ITEMS.length];
          const rawImg =
            typeof item.image === "string" ? item.image.trim() : "";

          return {
            id: Number(item.id) || fallback.id,
            title: (item.title || fallback.title).trim(),
            description: (item.description || fallback.description).trim(),
            image: rawImg.length > 0 ? rawImg : fallback.image,
          };
        });

      return sanitized.length > 0 ? sanitized : DEFAULT_ONBOARDING_ITEMS;
    }

    return DEFAULT_ONBOARDING_ITEMS;
  } catch (error) {
    console.warn("[Onboarding] Fetch failed, using fallback items:", error);
    return DEFAULT_ONBOARDING_ITEMS;
  }
};
