
export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  description?: string;
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
