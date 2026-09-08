import { fetchTransportServices } from "@/services/transportService";
import { useQuery } from "@tanstack/react-query";

export const useTransportServices = () => {
  return useQuery({
    queryKey: ["transport_services"],
    queryFn: fetchTransportServices,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
