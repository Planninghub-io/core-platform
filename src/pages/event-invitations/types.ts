
export interface Invitation {
  id: string;
  event_id: string;
  template_id: string;
  status: string;
  created_at: string;
  invitation_recipients: {
    id: string;
    status: string;
    delivery_method: string;
    sent_at: string | null;
    contacts: {
      name: string;
      email: string | null;
      phone: string | null;
    };
  }[];
  invitation_templates: {
    name: string;
    description: string | null;
    template_html: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}
