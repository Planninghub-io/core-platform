
import { Link } from "react-router-dom";
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

const SideNav = () => {
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
      <SidebarFooter className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-center gap-2 px-2 py-2 text-foreground/80 hover:text-foreground hover:bg-accent"
          asChild
        >
          <Link to="/settings">
            <Settings className="h-6 w-6" />
            <span className="text-sm">Settings</span>
          </Link>
        </Button>
        <SidebarSeparator />
        <CompanySwitcher
          companies={companies}
          selectedCompany={selectedCompany}
          onCompanySelect={setSelectedCompany}
        />
        <UserProfile userProfile={userProfile} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
