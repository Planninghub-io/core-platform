
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const HelpMenu = () => {
  return (
    <div className="fixed bottom-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full p-0"
            title="Help & Legal"
          >
            <HelpCircle className="h-5 w-5 text-gray-500 hover:text-gray-900" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="flex flex-col space-y-1">
            <Link
              to="/privacy"
              className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              Terms of Service
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
