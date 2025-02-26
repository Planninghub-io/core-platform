
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Invitation {
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
  };
}

const EventInvitations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, [id]);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          invitation_recipients (
            id,
            status,
            delivery_method,
            sent_at,
            contacts (
              name,
              email,
              phone
            )
          ),
          invitation_templates (
            name,
            description
          )
        `)
        .eq('event_id', id)
        .returns<Invitation[]>();

      if (error) throw error;

      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/event/${id}?edit=true`)} className="px-3">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold mt-4">Event Invitations</h1>
      </div>

      {loading ? (
        <div>Loading invitations...</div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No invitations have been sent for this event yet.
        </div>
      ) : (
        <div className="space-y-6">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {invitation.invitation_templates.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {invitation.invitation_templates.description}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invitation.status)}`}>
                  {invitation.status}
                </span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Recipients</h4>
                <div className="grid gap-2">
                  {invitation.invitation_recipients.map((recipient) => (
                    <div key={recipient.id} className="flex justify-between items-center bg-muted p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{recipient.contacts.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipient.delivery_method === 'email' 
                            ? recipient.contacts.email 
                            : recipient.contacts.phone}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(recipient.status)}`}>
                        {recipient.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventInvitations;
