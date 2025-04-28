
import React from 'react';
import { Button } from "@/components/ui/button";
import { Ticket, Share2, Link as LinkIcon, Settings } from 'lucide-react';

interface EventPreviewOptionsProps {
  category?: string;
}

export const EventPreviewOptions: React.FC<EventPreviewOptionsProps> = ({
  category
}) => {
  // Check if ticketing should be hidden based on event category
  const hideTicketing = category?.toLowerCase() === 'birthday' || 
                       category?.toLowerCase() === 'wedding';

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Event Options</h3>
      <div className="grid grid-cols-2 gap-2">
        {!hideTicketing && (
          <Button variant="outline" size="sm" className="justify-start">
            <Ticket className="h-4 w-4 mr-2" />
            Add Ticketing
          </Button>
        )}
        <Button variant="outline" size="sm" className="justify-start">
          <Share2 className="h-4 w-4 mr-2" />
          Sharing Options
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <LinkIcon className="h-4 w-4 mr-2" />
          Custom URL
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Settings className="h-4 w-4 mr-2" />
          More Settings
        </Button>
      </div>
    </div>
  );
};
