
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Ticket } from "../../types";

interface TicketAdvancedFieldsProps {
  ticket: Partial<Ticket>;
  onInputChange: (field: keyof Ticket, value: any) => void;
}

export const TicketAdvancedFields = ({ 
  ticket, 
  onInputChange 
}: TicketAdvancedFieldsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <div 
        className="p-6 cursor-pointer" 
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <div className="flex items-center space-x-2">
          {showAdvanced ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
          <span className="text-lg font-medium">Advanced settings</span>
        </div>
      </div>
      
      {showAdvanced && (
        <>
          <div className="p-6 pt-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <Info size={16} className="text-gray-400" />
              </div>
              <Textarea
                id="description"
                value={ticket.description || ""}
                onChange={(e) => onInputChange("description", e.target.value)}
                placeholder="Describe what's included with this ticket type"
                className="min-h-[120px] text-base"
              />
            </div>
            
            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="status" className="text-base font-medium">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Info size={16} className="text-gray-400" />
              </div>
              <Select 
                defaultValue={ticket.status || "active"}
                onValueChange={(value) => onInputChange("status", value)}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">On sale</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
        </>
      )}
    </>
  );
};
