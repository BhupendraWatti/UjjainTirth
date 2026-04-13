export interface PackageDetails {
  package_description: string;
  price: string;
  duration: string;
  pickup_location: string;
  drop_location: string;
  transport: string;
  stay_type: string;
  meals: string;
  short_description: string;
}

export interface AdditionalInfo {
  things_to_carry: string;
  cancellation_policy: string;
  terms_conditions: string;
  notes: string;
}

export interface Package {
  id: number;
  name: string;
  image: string;
  price: string;
  duration: string;
  description: string;
  package_details: PackageDetails;
  additional_info: AdditionalInfo;
}
