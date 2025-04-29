
export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  created_at: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string | null;
  event_type: string;
  template_html: string;
  created_at: string;
}

export interface InvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventType: string;
}
