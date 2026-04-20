
import { fetchTemples } from '@/services/templeService';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseTempleParams {
  search?: string;
  tag?: number | null;
}

export const useTemples = ({ search, tag }: UseTempleParams) => {
  return useInfiniteQuery({
    queryKey: ['temples', search, tag],

    queryFn: ({ pageParam = 1 }) =>
      fetchTemples({
        page: pageParam,
        search,
        tag,
      }),

    // ✅ FIXED pagination logic
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;

      if (nextPage > lastPage.totalPages) {
        return undefined; // STOP
      }

      return nextPage;
    },

    initialPageParam: 1,
  });
};

