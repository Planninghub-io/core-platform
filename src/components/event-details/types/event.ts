
export interface Event {
  id: string;
  title: string;
  date: string;
  end_date: string;
  description: string | null;
  location: string | null;
  category: string | null;
  expected_attendees: number | null;
  image_url: string | null;
  status?: string;
  user_profiles?: {
    email: string | null;
  } | null;
  budget?: number | null;
  estimated_budget?: string | null;
}
