
export interface UserProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

export type CompanyResponse = {
  company: {
    id: string;
    name: string;
    logo_url?: string | null;
  } | null;
}
