
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-1 p-2">
      {companies.map((company) => (
        <Button
          key={company.id}
          variant="ghost"
          className={`w-full justify-start gap-2 text-purple-700 ${
            selectedCompany?.id === company.id ? 'bg-gradient-to-r from-violet-50 to-fuchsia-50' : ''
          }`}
          onClick={() => onCompanySelect(company)}
        >
          <Building2 className="h-4 w-4" />
          <span className="truncate">{company.name}</span>
        </Button>
      ))}
    </div>
  );
};
