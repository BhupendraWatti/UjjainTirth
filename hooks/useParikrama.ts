import { fetchParikramaData } from "@/services/parikramaService";
import { useQuery } from "@tanstack/react-query";

export const useParikrama = () => {
  return useQuery({
    queryKey: ["narmada_parikrama"],
    queryFn: fetchParikramaData,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
