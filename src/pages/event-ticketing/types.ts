
export interface Ticket {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number | null;
  quantity: number | null;
  is_unlimited: boolean;
  status: string | null;
  created_at: string;
  updated_at: string;
  booking_fee?: boolean;
}
