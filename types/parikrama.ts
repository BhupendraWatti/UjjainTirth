export type ParikramaModeType =
  | 'segmented'
  | 'ghat to ghat'
  | 'full parikrama'
  | 'custom'
  | string;

export interface ParikramaModeItem {
  id: number;
  title: string;
  image: string;
  mode_type: ParikramaModeType;
  duration: string;
  distance: string;
  short_description: string;
}

export type LocationType =
  | 'origin'
  | 'major stop'
  | 'sacred ghat'
  | 'important destination'
  | 'route point'
  | string;

export interface NarmadaLocationItem {
  id: number;
  title: string;
  image: string;
  location_type: LocationType;
  region: string;
  short_description: string;
  route_order: number;
  is_featured: boolean;
  is_active: boolean;
}

export interface NarmadaParikramaData {
  modes: ParikramaModeItem[];
  locations: NarmadaLocationItem[];
}
