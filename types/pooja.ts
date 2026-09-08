export type PoojaCategory =
  | 'shiva'
  | 'devi'
  | 'protection'
  | 'prosperity'
  | 'special'
  | 'other'
  | string;

export interface PoojaItem {
  id: number;
  title: string;
  image: string;
  temple: string;
  category: PoojaCategory;
  duration: string;
  short_purpose: string;
  starting_price: number | null;
  is_featured: boolean;
}
