
export interface Venue {
  name: string;
  capacity: number | null;
  indoor_space_sqft: number | null;
  outdoor_space_sqft: number | null;
  amenities: Record<string, boolean> | null;
  booking_policy: string | null;
  cancellation_policy: string | null;
  company_id: string;
}

export interface ScrapedVenue {
  name: string;
  capacity?: number;
  indoor_space_sqft?: number;
  outdoor_space_sqft?: number;
  amenities?: Record<string, boolean>;
  booking_policy?: string;
  cancellation_policy?: string;
}
