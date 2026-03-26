import { fetchTempleTags } from "@/services/templeTagService";
import { useQuery } from "@tanstack/react-query";

export const useTempleTags = () => {
  return useQuery({
    queryKey: ["temple-tags"],
    queryFn: fetchTempleTags,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
