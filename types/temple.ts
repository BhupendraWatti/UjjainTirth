export interface WPImage {
  source_url: string;
  alt_text?: string;
}

export interface WPMedia {
  source_url: string;
  alt_text?: string;
}

export interface WPEmbedded {
  "wp:featuredmedia"?: WPMedia[];
}

export interface TempleCategory {
  id: number;
  name: string;
  slug: string;
}
export interface AartiItem {
  aarti_name: string;
  starting_time: string;
  ending_time: string;
}
export interface AartiPeriod {
  period_title: string;
  aarti_list: AartiItem[];
}
export interface Temple {
  id: number;
  slug: string;
  title: string;
  content?: {
    rendered: string;
  };
  acf: {
    map_url: string;
    temple_short_description: string;
    temple_tag: {
      id: number;
      name: string;
      slug: string;
    };
    aarti_periods?: AartiPeriod[];
    latitude?: string; // ✅ ADD THIS
    longitude?: string;
  };
  image: string;
  featured_media: number;
  _embedded?: WPEmbedded;
  temple_category?: number[];
  date: string;
}

export interface PaginatedTempleResponse {
  temples: Temple[];
  totalPages: number;
  totalItems: number;
}
