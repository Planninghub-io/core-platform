
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NavMenu } from "@/components/navigation/NavMenu";
import { CompanySwitcher } from "@/components/navigation/CompanySwitcher";
import { UserProfile } from "@/components/navigation/UserProfile";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SideNav = () => {
  const navigate = useNavigate();
  const { userProfile, companies, selectedCompany, setSelectedCompany } = useUserProfile();

  return (
    <Sidebar className="border-r w-56">
      <SidebarContent>
        <div className="mt-2 mb-2 p-2 flex justify-center">
          <Link to="/" className="block transition-transform hover:scale-105">
            <img
              src="/lovable-uploads/cb9a4c3e-89f7-4f9f-9cc2-9c506bc7be70.png"
              alt="Company Logo"
              className="h-16 w-16 brightness-110"
            />
          </Link>
        </div>
        <NavMenu />
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <UserProfile userProfile={userProfile} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </Button>
            {companies.length > 1 && (
              <>
                <SidebarSeparator />
                <CompanySwitcher
                  companies={companies}
                  selectedCompany={selectedCompany}
                  onCompanySelect={setSelectedCompany}
                />
              </>
            )}
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
