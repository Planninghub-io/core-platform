
import { Button } from "@/components/ui/button";
import { Edit2, ChevronDown } from "lucide-react";
import { type Invitation, type RsvpStats } from "../types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface InvitationCardProps {
  invitation: Invitation;
  onEdit: (invitation: Invitation) => void;
}

export const InvitationCard = ({ invitation, onEdit }: InvitationCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const calculateRsvpStats = (): RsvpStats => {
    const stats = {
      accepted: 0,
      declined: 0,
      maybe: 0
    };

    invitation.invitation_recipients.forEach(recipient => {
      if (recipient.rsvp_status === 'accepted') {
        stats.accepted += 1;
      } else if (recipient.rsvp_status === 'declined') {
        stats.declined += 1;
      } else if (recipient.rsvp_status === 'maybe') {
        stats.maybe += 1;
      }
    });

    return stats;
  };

  const rsvpStats = calculateRsvpStats();

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {invitation.invitation_templates.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {invitation.invitation_templates.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invitation.status)}`}>
            {invitation.status}
          </span>
          {invitation.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(invitation)}
              className="ml-2"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div dangerouslySetInnerHTML={{ __html: invitation.invitation_templates.template_html }} />
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">RSVP Statistics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-green-600">{rsvpStats.accepted}</p>
            <p className="text-sm text-green-700">Accepted</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-red-600">{rsvpStats.declined}</p>
            <p className="text-sm text-red-700">Declined</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-yellow-600">{rsvpStats.maybe}</p>
            <p className="text-sm text-yellow-700">Maybe</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Recipients</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
