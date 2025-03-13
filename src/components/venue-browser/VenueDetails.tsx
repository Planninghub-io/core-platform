
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Users, Calendar, X, CheckCircle, XCircle } from "lucide-react";
import { Venue } from "@/hooks/useVenues";
import { format, addDays } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface VenueDetailsProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);
  
  if (!venue) return null;

  // Get unavailable dates from venue availability
  const unavailableDates = venue.availability?.dates || [];

  // Convert string dates to Date objects
  const disabledDates = unavailableDates.map(dateStr => new Date(dateStr));
  
  // Check if selected date is available
  const isDateAvailable = selectedDate ? 
    !unavailableDates.includes(format(selectedDate, 'yyyy-MM-dd')) : 
    false;

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

              <div className="pt-4">
                <Button 
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="bg-[#8b73f4] hover:bg-[#8b73f4]/90"
                >
                  {showCalendar ? "Hide Availability Calendar" : "Check Availability"}
                </Button>
              </div>
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

          {showCalendar && (
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="font-medium text-gray-900 mb-3">Venue Availability</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      return disabledDates.some(disabledDate => 
                        format(disabledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                      );
                    }}
                    className="rounded border"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col">
                    <h4 className="font-medium mb-2">Selected Date Availability</h4>
                    {selectedDate ? (
                      <div className="space-y-3">
                        <p className="text-gray-700">Date: {format(selectedDate, 'MMMM d, yyyy')}</p>
                        
                        <div className="flex items-center gap-2">
                          <span>Status:</span>
                          {isDateAvailable ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-5 w-5 mr-1 text-green-600" />
                              Available
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-5 w-5 mr-1 text-red-600" />
                              Unavailable
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-4">
                          Dates marked in the calendar show when the venue is available for booking.
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Please select a date on the calendar to check availability.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <span className="w-3 h-3 inline-block bg-[#8b73f4] rounded-full"></span>
                <span>Available dates</span>
                <span className="w-3 h-3 inline-block bg-gray-200 rounded-full ml-3"></span>
                <span>Unavailable dates</span>
              </div>
            </div>
          )}

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
