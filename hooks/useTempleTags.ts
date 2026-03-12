import { useQuery } from '@tanstack/react-query';
import { fetchTempleTags } from '@/services/templeTagService';

export const useTempleTags = () => {
  return useQuery({
    queryKey: ['templeTags'],
    queryFn: fetchTempleTags,
    staleTime: 1000 * 60 * 60,
  });
};