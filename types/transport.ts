export interface TransportHighlight {
  icon: string; // e.g. 'accessibility', 'seats', 'luggage', 'ac', 'driver', 'tv', 'charging'
  label: string; // e.g. 'Elder Step Available'
}

export type VehicleType =
  | 'Sedan'
  | 'SUV'
  | 'Premium MPV'
  | 'Tempo Traveller'
  | 'Mini Coach'
  | 'Bus'
  | string;

export type TransportServiceCategory =
  | 'all'
  | 'local'
  | 'airport / station'
  | 'full day'
  | 'outstation'
  | 'group'
  | string;

export interface TransportServiceItem {
  id: number;
  title: string;
  image: string;
  vehicle_type: VehicleType;
  passenger_capacity: number;
  short_description: string;
  service_category: TransportServiceCategory;
  highlights: TransportHighlight[];
  is_featured: boolean;
  is_recommended: boolean;
}
