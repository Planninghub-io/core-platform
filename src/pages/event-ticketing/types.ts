
export interface Ticket {
  id: string;
  event_id: string;
  ticket_name: string;
  description: string | null;
  price: number | null;
  quantity: number | null;
  status: string | null;
  created_at: string;
}
