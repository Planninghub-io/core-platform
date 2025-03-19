
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface DateTimeFieldProps {
  isFlexible: string;
  setIsFlexible: (value: string) => void;
  datetime: string;
  setDatetime: (value: string) => void;
  error?: string;
}

export const DateTimeField = ({
  isFlexible,
  setIsFlexible,
  datetime,
  setDatetime,
  error
}: DateTimeFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label>Date & Time</Label>
      <div className="flex flex-col gap-2">
        <RadioGroup value={isFlexible} onValueChange={setIsFlexible} className="mb-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="flexible" />
            <Label htmlFor="flexible">Date & time is flexible</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="specific" />
            <Label htmlFor="specific">Specific date & time</Label>
          </div>
        </RadioGroup>
        {isFlexible === "no" && (
          <div className="relative">
            <Input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className={cn(error ? "border-red-500" : "")}
              min={new Date().toISOString().slice(0, 16)}
            />
            <Calendar className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
        {error && (
          <span className="text-sm text-red-500">{error}</span>
        )}
      </div>
    </div>
  );
};
