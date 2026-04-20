import { useQuery } from "@tanstack/react-query";
import { fetchAccommodation } from "@/services/serviceServices";

export const useAccommodation = () => {
  return useQuery({
    queryKey: ["accommodation"],
    queryFn: fetchAccommodation,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
