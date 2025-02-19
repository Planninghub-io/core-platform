
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const SettingsLayout = () => {
  const location = useLocation();

  const tabs = [
    { title: "User Profile", path: "/settings/profile" },
    { title: "Company Settings", path: "/settings/company" }
  ];

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="flex gap-6">
        <aside className="w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === tab.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                {tab.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
