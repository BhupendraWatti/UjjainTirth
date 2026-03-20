export interface WPImage {
  source_url: string;
  alt_text?: string;
}

export interface WPMedia {
  source_url: string;
  alt_text?: string;
}

export interface WPEmbedded {
  'wp:featuredmedia'?: WPMedia[];
}

export interface TempleCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Temple{
    id:number;
    slug:string;
    title:{
        rendered:string;
    }
    content?:{
        rendered:string;
    }
    acf:{
        map_url:string;
        temple_short_description:string;
        temple_tag:number;
    }
    featured_media:number;

    _embedded?: WPEmbedded;
    temple_category?: number[];
    date: string;
    
}

export interface PaginatedTempleResponse {
  temples: Temple[];
  totalPages: number;
  totalItems: number;
}