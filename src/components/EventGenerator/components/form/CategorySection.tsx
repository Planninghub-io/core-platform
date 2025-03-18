
import React from "react";
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Event categories
const EVENT_CATEGORIES = [
  { value: "Wedding", label: "Wedding" },
  { value: "Birthday", label: "Birthday" },
  { value: "Corporate", label: "Corporate Event" },
  { value: "Conference", label: "Conference" },
  { value: "Seminar", label: "Seminar" },
  { value: "Social", label: "Social Gathering" },
  { value: "Other", label: "Other" }
];

interface CategorySectionProps {
  category: string;
  setCategory: (category: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  setCategory
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-500" />
        <Label htmlFor="category">Event Type</Label>
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select event type" />
        </SelectTrigger>
        <SelectContent>
          {EVENT_CATEGORIES.map(cat => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
