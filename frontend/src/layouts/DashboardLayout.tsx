
import { NavLink, Outlet, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  UserRound,
  House,
  PlusCircle,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Listings", path: "/dashboard/listings", icon: House },
    { name: "Add Property", path: "/dashboard/create", icon: PlusCircle },
    { name: "My Profile", path: "/dashboard/profile", icon: UserRound },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Unable to log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5]">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white p-6 md:flex md:flex-col">

          <Link to="/" className="mb-10">
            <img
              src="/dreamdwell-logo.png"
              alt="DreamDwell"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#E9F5ED] text-[#39865A]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-gray-100 pt-5">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F5ED] font-semibold text-[#39865A]">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>

            <Link
              to="/"
              className="mt-3 flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-black"
            >
              <ArrowLeft size={18} />
              Back to website
            </Link>

          </div>
        </aside>

        {/* DASHBOARD CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="border-b border-gray-100 bg-white px-5 py-5 md:px-9">
            <h1 className="text-lg font-semibold">
              DreamDwell Dashboard
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Manage your properties and account.
            </p>
          </div>

          <div className="p-5 md:p-9">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
