
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
import { LogOut, Settings, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SideNav = () => {
  const navigate = useNavigate();
  const { userProfile, companies, selectedCompany, setSelectedCompany, isLoading } = useUserProfile();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      // Force navigation to auth page
      navigate('/auth', { replace: true });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  // Listen for auth state changes and redirect if not logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
        {isLoading ? (
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        ) : (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <div>
                {userProfile ? (
                  <UserProfile userProfile={userProfile} />
                ) : (
                  <div className="p-4 cursor-pointer hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate text-purple-900">
                          Sign In
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 space-y-2">
              {userProfile && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/settings');
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </Button>
                  {companies && companies.length > 1 && (
                    <>
                      <SidebarSeparator />
                      <CompanySwitcher
                        companies={companies}
                        selectedCompany={selectedCompany}
                        onCompanySelect={(company) => {
                          setSelectedCompany(company);
                          setIsOpen(false);
                        }}
                      />
                    </>
                  )}
                </>
              )}
              {!userProfile && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/auth');
                  }}
                >
                  Sign In
                </Button>
              )}
            </PopoverContent>
          </Popover>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
