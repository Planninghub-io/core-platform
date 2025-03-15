
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Venue } from "@/hooks/useVenues";

interface RFPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVenues: Venue[];
}

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate Event" },
  { value: "birthday", label: "Birthday Party" },
  { value: "conference", label: "Conference" },
  { value: "social", label: "Social Gathering" },
  { value: "other", label: "Other" }
];

export const RFPDialog: React.FC<RFPDialogProps> = ({ isOpen, onClose, selectedVenues }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Event details
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  const handleSubmit = async () => {
    if (!eventName || !eventType || !eventDate || !guestCount) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to submit an RFP",
          variant: "destructive",
        });
        return;
      }

      const eventDetails = {
        name: eventName,
        type: eventType,
        date: eventDate.toISOString().split('T')[0],
        guestCount: parseInt(guestCount),
        budget: budget ? parseFloat(budget) : null
      };

      const requestDetails = {
        specialRequirements
      };

      // Get venue IDs
      const venueIds = selectedVenues.map(venue => venue.id);

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('venue-rfp', {
        body: {
          eventDetails,
          requestDetails,
          selectedVenueIds: venueIds,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Success!",
        description: `Request for proposal sent to ${selectedVenues.length} venues`,
      });

      // Reset form and close
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("Error submitting RFP:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEventName("");
    setEventType("");
    setEventDate(undefined);
    setGuestCount("");
    setBudget("");
    setSpecialRequirements("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Request Proposals from {selectedVenues.length} Venue{selectedVenues.length > 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Selected Venues:</h3>
            <div className="max-h-[100px] overflow-y-auto bg-gray-50 p-2 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {selectedVenues.map(venue => (
                  <li key={venue.id} className="text-sm text-gray-600">{venue.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="eventName">Event Name <span className="text-red-500">*</span></Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventType">Event Type <span className="text-red-500">*</span></Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="eventType" className="mt-1">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="eventDate">Event Date <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="eventDate"
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? format(eventDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestCount">Guest Count <span className="text-red-500">*</span></Label>
                <Input
                  id="guestCount"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Number of guests"
                  type="text"
                  inputMode="numeric"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="budget">Budget (Optional)</Label>
                <Input
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="Your budget"
                  type="text"
                  inputMode="decimal"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Any specific requirements or questions for the venues"
                className="mt-1 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#8b73f4] hover:bg-[#8b73f4]/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit RFP'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
