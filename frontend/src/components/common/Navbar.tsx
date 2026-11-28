import { Link, NavLink, useNavigate } from "react-router";
import { Menu, Search, UserRound } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { name: "Buy", path: "/properties?listingType=Sale" },
    { name: "Rent", path: "/properties?listingType=Rent" },
    { name: "Properties", path: "/properties" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#171717] text-white">
      <nav className="mx-auto flex max-w-360 items-center justify-between px-4 py-3 lg:px-12">
        <Link to="/" className="flex items-center">
          <img
            src="/dreamdwell-logo1-removebg.png"
            alt="DreamDwell Real Estate"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className="text-sm text-gray-300 transition hover:text-[#B9E4C8]"
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/properties"
            className="flex items-center gap-2 rounded-lg bg-[#292929] px-4 py-2.5 text-sm text-gray-300 hover:bg-[#353535]"
          >
            <Search size={17} />
            Search properties
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm sm:block">Hi, {user?.name}</span>

              <Link
                to="/dashboard"
                className="rounded-lg bg-[#B9E4C8] px-4 py-2.5 text-sm font-semibold text-black"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </span>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-sm hover:text-[#B9E4C8]"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link to="/login" className="text-sm">
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-[#B9E4C8] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden" aria-label="Open menu">
          <Menu size={25} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
