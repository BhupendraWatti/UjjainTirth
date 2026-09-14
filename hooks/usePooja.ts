import { fetchPoojas, fetchPoojaById } from "@/services/poojaService";
import { FetchPoojaParams, PoojaItem } from "@/types/pooja";
import { useQuery } from "@tanstack/react-query";

export const usePoojas = (params?: FetchPoojaParams) => {
  return useQuery<PoojaItem[]>({
    queryKey: ["poojas", params],
    queryFn: () => fetchPoojas(params),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

export const usePoojaById = (id: number | string | undefined) => {
  return useQuery<PoojaItem | null>({
    queryKey: ["pooja", id],
    queryFn: () => (id ? fetchPoojaById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  });
};

