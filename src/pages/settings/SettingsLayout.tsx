
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const SettingsLayout = () => {
  const location = useLocation();

  const tabs = [
    { title: "Settings", path: "/settings" },
    { title: "User Profile", path: "/settings/profile" },
    { title: "Company Settings", path: "/settings/company" },
    { title: "Billing", path: "/settings/billing" }
  ];

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <nav className="flex gap-4 p-1 bg-gradient-to-r from-purple-50/80 to-fuchsia-50/80 rounded-lg">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "px-6 py-3 rounded-md text-sm font-medium transition-all duration-200",
                location.pathname === tab.path
                  ? "bg-[#8b73f4] text-white shadow-sm"
                  : "text-[#6E59A5] hover:bg-[#8b73f4]/10"
              )}
            >
              {tab.title}
            </Link>
          ))}
        </nav>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
