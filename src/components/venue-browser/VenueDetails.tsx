
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Users, Calendar, X } from "lucide-react";
import { Venue } from "@/hooks/useVenues";

interface VenueDetailsProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue, isOpen, onClose }) => {
  if (!venue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex justify-between items-center">
            <span>{venue.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {venue.capacity && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-[#8b73f4] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Capacity</h3>
                    <p className="text-gray-700">{venue.capacity} people</p>
                  </div>
                </div>
              )}

              {(venue.indoor_space_sqft || venue.outdoor_space_sqft) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#8b73f4] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Space</h3>
                    <p className="text-gray-700">
                      {venue.indoor_space_sqft ? `${venue.indoor_space_sqft} sq ft indoor` : ''} 
                      {venue.indoor_space_sqft && venue.outdoor_space_sqft ? ' / ' : ''}
                      {venue.outdoor_space_sqft ? `${venue.outdoor_space_sqft} sq ft outdoor` : ''}
                    </p>
                  </div>
                </div>
              )}
              
              {venue.booking_policy && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#8b73f4] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Booking Policy</h3>
                    <p className="text-gray-700">{venue.booking_policy}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              {venue.amenities && Object.keys(venue.amenities).length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(venue.amenities).map(([key, value]) => (
                      value ? (
                        <div key={key} className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-[#8b73f4]"></div>
                          <span className="text-gray-700">{key.replace(/_/g, ' ')}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {venue.cancellation_policy && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cancellation Policy</h3>
              <p className="text-gray-700">{venue.cancellation_policy}</p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="bg-[#8b73f4] hover:bg-[#8b73f4]/90">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
