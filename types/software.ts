export interface Vendor {
    vendor_id: string;
    name: string;
  }
  
  export interface BusinessNeed {
    businessNeedsId: string;
    name: string;
    associations?: string[];
  }
  
  export interface PainPoint {
    painPointId: string;
    name: string;
    businessNeedsId: string;
    associations?: string[];
  }
  
  export interface Feature {
    featureId: string;
    name: string;
    businessNeedsId: string;
    associations?: string[];
  }
  
  export interface PricingTier {
    tierName: string;
    price: string;
    duration: string;
    maxUsers: string;
    features: string[];
  }
  
  export interface Testimony {
    userName: string;
    industry: string;
    text: string;
    featuresBenefitted: string[];
  }
  
  export interface FormData {
    vendor: Vendor | null;
    logo: File | null;
    logoUrl?: string;
    industries: string[];
    business_needs: BusinessNeed[];
    pain_points: PainPoint[];
    key_features: Feature[];
    is_free: boolean;
    pricing_tiers: PricingTier[];
    testimonies: Testimony[];
    [key: string]: any;
  }

  export type SetFormData = (data: FormData | ((prev: FormData) => FormData)) => void;