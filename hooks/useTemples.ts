// import { useInfiniteQuery } from '@tanstack/react-query';
// import { fetchTemples } from '@/services/templeService'; 
// // fetchTemples is only giving the url to the user. 
// import { Temple } from '@/types/temple';

// interface UseTempleParams {
//   search?: string;
//   tag?: number | null;
// }

// export const useTemples = ({ search, tag }: UseTempleParams) => {
//   return useInfiniteQuery({
//     queryKey: ['temples', search, tag],

//     queryFn: ({ pageParam = 1 }) =>
//       fetchTemples({
//         page: pageParam,
//         search,
//         tag,
//       }),

//     getNextPageParam: (lastPage: Temple[], allPages: Temple[][]) => {
//       if (lastPage.length === 0) {
//         return undefined;
//       }

//       return allPages.length + 1;
//     },

//     initialPageParam: 1,
//   });
// };

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTemples } from '@/services/templeService';

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

