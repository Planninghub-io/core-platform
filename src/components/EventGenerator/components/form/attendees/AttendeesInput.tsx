
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

interface AttendeesInputProps {
  attendees: string;
  setAttendees: (attendees: string) => void;
}

export const AttendeesInput: React.FC<AttendeesInputProps> = ({
  attendees,
  setAttendees
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-gray-500" />
        <Label htmlFor="attendees">Attendees</Label>
      </div>
      <Input
        id="attendees"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
        placeholder="Number of attendees"
        type="number"
        min="1"
      />
    </div>
  );
};
