
import { Home, Calendar, Compass, Store, Ticket } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
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
    submenu: [
      {
        title: "Venues",
        path: "/marketplace/venues",
      },
      {
        title: "Vendors",
        path: "/marketplace/vendors",
      }
    ]
  },
  {
    title: "Explore",
    icon: Compass,
    path: "/discover",
  },
];

export const NavMenu = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.submenu ? (
                <>
                  <SidebarMenuButton
                    asChild
                    className={location.pathname.startsWith(item.path) ? "bg-accent/10" : ""}
                  >
                    <div className="flex items-center px-4 py-2 text-foreground/80 hover:text-foreground">
                      <item.icon className="h-6 w-6" />
                      <span className="text-sm ml-3">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                  {item.submenu.map(subItem => (
                    <Link 
                      key={subItem.title}
                      to={subItem.path}
                      className={`flex items-center px-4 py-2 pl-12 text-sm text-foreground/70 hover:text-foreground hover:bg-accent/5 rounded-md ${
                        location.pathname === subItem.path ? "bg-accent/10 text-foreground" : ""
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </>
              ) : (
                <SidebarMenuButton
                  asChild
                  className={location.pathname === item.path ? "bg-accent/10" : ""}
                >
                  <Link to={item.path} className="flex items-center px-4 py-2 text-foreground/80 hover:text-foreground">
                    <item.icon className="h-6 w-6" />
                    <span className="text-sm ml-3">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
