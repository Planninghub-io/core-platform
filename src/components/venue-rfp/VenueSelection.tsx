
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Venue } from "@/hooks/useVenues";
import { FileText } from "lucide-react";
import { RFPDialog } from "./RFPDialog";

interface VenueSelectionProps {
  venues: Venue[] | undefined;
}

export const VenueSelection: React.FC<VenueSelectionProps> = ({ venues }) => {
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>([]);
  const [showRFPDialog, setShowRFPDialog] = useState(false);

  const handleVenueSelection = (venue: Venue, isSelected: boolean) => {
    if (isSelected) {
      setSelectedVenues(prev => [...prev, venue]);
    } else {
      setSelectedVenues(prev => prev.filter(v => v.id !== venue.id));
    }
  };

  const handleOpenRFP = () => {
    if (selectedVenues.length === 0) {
      return;
    }
    setShowRFPDialog(true);
  };

  const handleCloseRFP = () => {
    setShowRFPDialog(false);
  };

  return (
    <>
      {venues && venues.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <span className="text-sm font-medium">
                {selectedVenues.length === 0 
                  ? "Select venues to request proposals" 
                  : `${selectedVenues.length} venue${selectedVenues.length > 1 ? 's' : ''} selected`}
              </span>
            </div>
            <Button
              onClick={handleOpenRFP}
              disabled={selectedVenues.length === 0}
              size="sm"
              className="bg-[#8b73f4] hover:bg-[#8b73f4]/90 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Request Proposals
            </Button>
          </div>
        </div>
      )}

      {/* Add checkbox to each venue card */}
      {venues && venues.map((venue) => (
        <div 
          key={venue.id} 
          className="absolute top-3 right-3 z-10" 
          data-venue-id={venue.id}
        >
          <Checkbox
            id={`select-venue-${venue.id}`}
            checked={selectedVenues.some(v => v.id === venue.id)}
            onCheckedChange={(checked) => 
              handleVenueSelection(venue, checked === true)
            }
            className="h-5 w-5 border-2 border-white bg-white/80 data-[state=checked]:bg-[#8b73f4] data-[state=checked]:text-white"
          />
        </div>
      ))}

      <RFPDialog 
        isOpen={showRFPDialog} 
        onClose={handleCloseRFP} 
        selectedVenues={selectedVenues} 
      />
    </>
  );
};
