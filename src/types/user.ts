
export interface UserProfile {
  id?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  name_suffix?: string;
  avatar_url?: string;
  email?: string;
  contact_number?: string;
  dob?: string;
  user_type?: string;
  address?: string;
  stripe_account_id?: string;
  created_at?: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string | null;
  business_email?: string | null;
  business_phone?: string | null;
  website_url?: string | null;
  dba?: string;
}

export type CompanyResponse = {
  company: Company | null;
}
