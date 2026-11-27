
import { Link } from "react-router";


import { ArrowUpRight } from "lucide-react";
import { RiInstagramLine, RiFacebookLine, RiLinkedinLine } from "@remixicon/react";


const Footer = () => {
  return (
    <footer className="bg-[#171717] px-6 pb-8 pt-16 text-white lg:px-12">

      <div className="mx-auto grid max-w-360 gap-12 sm:grid-cols-2 lg:grid-cols-4">

        <div>
          <Link to="/" className="inline-block">
            <img
              src="/dreamdwell-logo.png"
              alt="DreamDwell"
              className="h-14 w-auto rounded bg-white object-contain"
            />
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
            Discover spaces that inspire your lifestyle.
            Find your next home with DreamDwell.
          </p>

          <div className="mt-6 flex gap-4 text-gray-400">
            <a href="#" aria-label="RiInstagramLine" className="hover:text-[#B9E4C8]">
              <RiInstagramLine size={20} />
            </a>
            <a href="#" aria-label="RiFacebookLine" className="hover:text-[#B9E4C8]">
              <RiFacebookLine size={20} />
            </a>
            <a href="#" aria-label="RiLinkedinLine" className="hover:text-[#B9E4C8]">
              <RiLinkedinLine size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">Explore</h3>
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <Link to="/properties" className="hover:text-[#B9E4C8]">Buy Properties</Link>
            <Link to="/properties?listingType=Rent" className="hover:text-[#B9E4C8]">Rent Properties</Link>
            <Link to="/properties" className="hover:text-[#B9E4C8]">All Listings</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">Company</h3>
          <div className="flex flex-col gap-4 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#B9E4C8]">About DreamDwell</Link>
            <Link to="/" className="hover:text-[#B9E4C8]">Contact</Link>
            <Link to="/" className="hover:text-[#B9E4C8]">Privacy Policy</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 font-semibold">Find your next home</h3>
          <p className="text-sm leading-6 text-gray-400">
            Explore beautiful properties and discover a place
            that feels like yours.
          </p>

          <Link
            to="/properties"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B9E4C8] hover:gap-3"
          >
            Start exploring <ArrowUpRight size={17} />
          </Link>
        </div>

      </div>

      <div className="mx-auto mt-14 flex max-w-360 flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} DreamDwell Real Estate. All rights reserved.</p>
        <p>Made for finding your dream home.</p>
      </div>

    </footer>
  );
};

export default Footer;
