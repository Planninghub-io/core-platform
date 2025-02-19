
import { Home, Calendar, Compass, Settings, Store, UserRound, Building2, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
}

interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

type CompanyResponse = {
  company: {
    id: string;
    name: string;
    logo_url?: string | null;
  } | null;
}

const menuItems = [
  {
    title: "Home",
    icon: Home,
    path: "/",
  },
  {
    title: "Events Hub",
    icon: Calendar,
    path: "/events-hub",
  },
  {
    title: "Marketplace",
    icon: Store,
    path: "/marketplace",
  },
  {
    title: "Discover",
    icon: Compass,
    path: "/discover",
  },
];

const SideNav = () => {
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, avatar_url, email')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setUserProfile(profileData);

          // Fetch user's companies
          const { data: companyMembers, error: companyError } = await supabase
            .from('company_members')
            .select(`
              company:companies (
                id,
                name,
                logo_url
              )
            `)
            .eq('user_id', user.id)
            .eq('status', 'active');

          if (companyError) throw companyError;

          const userCompanies = (companyMembers as CompanyResponse[] ?? [])
            .map(member => member.company)
            .filter((company): company is Company => 
              company !== null && 
              typeof company.id === 'string' && 
              typeof company.name === 'string'
            );

          setCompanies(userCompanies);
          if (userCompanies.length > 0) {
            setSelectedCompany(userCompanies[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const getInitials = (profile: UserProfile) => {
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase() || profile.email?.[0].toUpperCase() || 'U';
  };

  const getDisplayName = (profile: UserProfile) => {
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return profile.email?.split('@')[0] || 'User';
  };

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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location.pathname === item.path ? "bg-accent/10" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-6 w-6" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-2">
        {companies.length > 0 && (
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
                      onClick={() => setSelectedCompany(company)}
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="truncate">{company.name}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
        {userProfile && (
          <>
            <div className="px-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                asChild
              >
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </Button>
            </div>
            <div className="p-4 border-t">
              <Link to="/settings/profile" className="flex items-center gap-3 hover:bg-accent/10 p-2 rounded-md transition-colors">
                <Avatar>
                  <AvatarImage src={userProfile.avatar_url} />
                  <AvatarFallback className="bg-primary/10">
                    {getInitials(userProfile)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {getDisplayName(userProfile)}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {userProfile.email}
                  </span>
                </div>
              </Link>
            </div>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideNav;
