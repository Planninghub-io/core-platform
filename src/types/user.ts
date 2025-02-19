
export interface UserProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
  contact_number?: string;
  dob?: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  business_email?: string;
  business_phone?: string;
  website_url?: string;
  dba?: string;
}

export type CompanyResponse = {
  company: Company | null;
}
