
import { Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Company } from "@/types/user";

interface CompanySwitcherProps {
  companies: Company[];
  selectedCompany: Company | null;
  onCompanySelect: (company: Company) => void;
}

export const CompanySwitcher = ({
  companies,
  selectedCompany,
  onCompanySelect,
}: CompanySwitcherProps) => {
  if (companies.length === 0) return null;

  return (
    <div className="px-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{selectedCompany?.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <div className="space-y-1 p-1">
            {companies.map((company) => (
              <Button
                key={company.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => onCompanySelect(company)}
              >
                <Building2 className="h-4 w-4" />
                <span className="truncate">{company.name}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
