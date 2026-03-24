import { fetchTempleTags } from "@/services/templeTagService";
import { useQuery } from "@tanstack/react-query";

export const useTempleTags = () => {
  return useQuery({
    queryKey: ["temples"],
    queryFn: fetchTempleTags,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
