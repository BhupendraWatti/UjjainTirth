export type PoojaCategory =
  | 'shiva'
  | 'devi'
  | 'protection'
  | 'prosperity'
  | 'special'
  | 'other'
  | string;

export interface PoojaDakshinaTier {
  title: string;
  price: number | null;
  description?: string;
}

export interface PoojaWorkflowStep {
  step_number: number;
  title: string;
  description: string;
}

export interface PoojaWhatWeProvide {
  icon: string;
  title: string;
  description: string;
}

export interface PoojaItem {
  id: number;
  title: string;
  image: string;
  temple: string;
  category: PoojaCategory;
  duration: string;
  short_purpose: string;
  description?: string;
  starting_price: number | null;
  muhurat_timings?: string;
  samagri_list?: string[];
  benefits?: string[];
  dakshina_tiers?: PoojaDakshinaTier[];
  badge_tag?: string;
  is_featured: boolean;
  workflow_steps?: PoojaWorkflowStep[];
  what_we_provide?: PoojaWhatWeProvide[];
}

export interface FetchPoojaParams {
  category?: string;
  featured?: boolean;
  search?: string;
  temple?: string;
}

export interface PoojaBookingPayload {
  pooja_id: number;
  name: string;
  phone: string;
  gotra?: string;
  preferred_date?: string;
  dakshina_tier?: string;
  notes?: string;
}
