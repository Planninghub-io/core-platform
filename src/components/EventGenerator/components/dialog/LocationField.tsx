
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LocationFieldProps {
  location: string;
  setLocation: (value: string) => void;
  error?: string;
}

export const LocationField = ({
  location,
  setLocation,
  error
}: LocationFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="location">Location</Label>
      <Input
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter venue or location"
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};
