
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
      <div className="space-y-6">
        <nav className="flex gap-4 p-1 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-lg">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "px-6 py-3 rounded-md text-sm font-medium transition-all duration-200",
                location.pathname === tab.path
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-purple-700 hover:bg-purple-100"
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
