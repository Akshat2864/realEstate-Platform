import { Link, NavLink } from "react-router";
import { Menu, Search, UserRound } from "lucide-react";

const Navbar = () => {
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

          <Link
            to="/login"
            className="flex items-center gap-2 text-sm hover:text-[#B9E4C8]"
          >
            <UserRound size={17} />
            Sign in
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#B9E4C8] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#a3d9b6]"
          >
            Sign up
          </Link>
        </div>

        <button className="md:hidden" aria-label="Open menu">
          <Menu size={25} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
