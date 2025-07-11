export interface ILEAVendor {
  id: string;
  name: string;
  description?: string;
  city?: string;
  zipcode?: string;
  price_range_start?: number;
  price_range_end?: number;
  company?: {
    name: string;
    id: string;
    business_email?: string;
    business_phone?: string;
    website_url?: string;
  };
}

export interface ILEAVenue {
  id: string;
  name: string;
  location?: string;
  city?: string;
  zipcode?: string;
  capacity?: number;
  amenities?: any;
  company?: {
    name: string;
    id: string;
    business_email?: string;
    business_phone?: string;
    website_url?: string;
    address?: string;
  };
}