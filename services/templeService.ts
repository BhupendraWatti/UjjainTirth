// import { API_BASE_URL, API_ENDPOINTS, PAGINATION, DEFAULT_HEADERS } from '@/constants/api';
// import { Temple } from '@/types/temple';

// interface FetchTempleParams {
//   page?: number;
//   search?: string;
//   tag?: number | null;
// }

// export const fetchTemples = async ({
//   page = 1,
//   search,
//   tag,
// }: FetchTempleParams): Promise<Temple[]> => {
//   try {
//     const params = new URLSearchParams();

//     params.append('page', page.toString());
//     params.append('per_page', PAGINATION.PAGE_SIZE.toString());
//     params.append('_embed', 'true');

//     if (search) {
//       params.append('search', search);
//     }

//     if (tag) {
//       params.append('temple_tag', tag.toString());
//     }

//     const url = `${API_BASE_URL}${API_ENDPOINTS.TEMPLES}?${params.toString()}`;

//     const response = await fetch(url, {
//       headers: DEFAULT_HEADERS,
//     });

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }

//     const data: Temple[] = await response.json();

//     return data;
//   } catch (error) {
//     console.error('Temple fetch failed:', error);
//     throw error;
//   }
// };

import { API_BASE_URL, API_ENDPOINTS, PAGINATION, DEFAULT_HEADERS } from '@/constants/api';
import { Temple } from '@/types/temple';

interface FetchTempleParams {
  page?: number;
  search?: string;
  tag?: number | null;
}

interface FetchTempleResponse {
  data: Temple[];
  totalPages: number;
}

export const fetchTemples = async ({
  page = 1,
  search,
  tag,
}: FetchTempleParams): Promise<FetchTempleResponse> => {
  try {
    const params = new URLSearchParams();

    // ✅ Required params
    params.append('page', page.toString());
    params.append('per_page', PAGINATION.PAGE_SIZE.toString());
    params.append('_embed', 'true');

    // ✅ Optional params (ONLY if valid)
    if (search && search.trim() !== '') {
      params.append('search', search);
    }

    if (tag !== null && tag !== undefined) {
      params.append('temple_tag', tag.toString());
    }

    const url = `${API_BASE_URL}${API_ENDPOINTS.TEMPLES}?${params.toString()}`;

    console.log('API URL:', url); // 🔍 Debug

    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
    });

    // ❌ Handle API error
    if (!response.ok) {
      // Special handling for page overflow
      if (response.status === 400) {
        return {
          data: [],
          totalPages: page - 1, // stop further calls
        };
      }

      throw new Error(`API Error: ${response.status}`);
    }

    const totalPages = Number(response.headers.get('X-WP-TotalPages') || 1);

    const data: Temple[] = await response.json();

    return { data, totalPages };
  } catch (error) {
    console.error('Temple fetch failed:', error);
    throw error;
  }
};