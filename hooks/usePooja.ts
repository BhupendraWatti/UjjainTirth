import { fetchPoojas } from "@/services/poojaService";
import { useQuery } from "@tanstack/react-query";

export const usePoojas = () => {
  return useQuery({
    queryKey: ["poojas"],
    queryFn: fetchPoojas,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
