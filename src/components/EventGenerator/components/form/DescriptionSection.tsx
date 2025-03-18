
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  description: string;
  setDescription: (description: string) => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  description,
  setDescription
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Event description"
        className="min-h-[100px]"
      />
    </div>
  );
};
