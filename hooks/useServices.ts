import { useQuery } from "@tanstack/react-query";
import { fetchService } from "@/services/serviceServices";

export const useServices = ()=> {
    return useQuery({
        queryKey: ['services'],
        queryFn: fetchService,
    });
};