
import { Home, Calendar, Compass, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="mt-2 mb-4 p-6 flex justify-center">
          <Link to="/" className="block transition-transform hover:scale-105">
            <img
              src="/lovable-uploads/cb9a4c3e-89f7-4f9f-9cc2-9c506bc7be70.png"
              alt="Company Logo"
              className="h-20 w-20 brightness-110"
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
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideNav;
