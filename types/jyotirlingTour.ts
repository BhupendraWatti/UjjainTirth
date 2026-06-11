export interface JyotirlingLocationTag {
  id: number;
  name: string;
  slug: string;
}

export interface JyotirlingTourACF {
  jyotirling_name: string;
  jyotirling_image: string;
  jyotirling_location_tag: JyotirlingLocationTag | string | null;
  jyotirling_description: string;
  jyotirling_location: string;
  latitude: string;
  longitude: string;
}

export interface JyotirlingTour {
  id: number;
  slug: string;
  title: string;
  image: string;
  featured_image: string;
  acf: JyotirlingTourACF;
}

export interface PaginatedJyotirlingTourResponse {
  data: JyotirlingTour[];
  totalPages: number;
}
