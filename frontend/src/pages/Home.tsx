
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  Search,
  Home as HomeIcon,
  Building2,
  Store,
  MapPin,
  ShieldCheck,
  Headset,
  KeyRound,
} from "lucide-react";

import PropertyCard from "../components/property/PropertyCard";
import { getAllProperties } from "../services/property.service";

import type { Property } from "../types/property.types";

const categories = [
  {
    name: "House",
    description: "Find your perfect family home",
    icon: HomeIcon,
  },
  {
    name: "Apartment",
    description: "Modern city living",
    icon: Building2,
  },
  {
    name: "Commercial",
    description: "Spaces for your business",
    icon: Store,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [listingType, setListingType] = useState("Sale");
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProperties({
          limit: 6,
          sort: "newest",
        });

        setProperties(data.properties);
      } catch (err) {
        console.error(err);
        setError("Unable to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    params.set("listingType", listingType);

    if (city.trim()) {
      params.set("city", city.trim());
    }

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden bg-[#F7F7F5]">

      {/* HERO SECTION */}
      <section className="mx-auto max-w-360 px-5 pb-16 pt-10 lg:px-12 lg:pt-16">

        <div className="relative min-h-135 overflow-hidden rounded-[28px] bg-[#171717]">

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury DreamDwell property"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          <div className="relative z-10 flex min-h-135 flex-col justify-center px-7 py-16 sm:px-12 lg:px-20">

            <span className="mb-6 flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#B9E4C8]" />
              Your next chapter starts here
            </span>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
              Find a place
              <br />
              you'll love to
              <span className="text-[#B9E4C8]"> call home.</span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-7 text-gray-200 sm:text-base">
              Discover thoughtfully selected homes, beautiful
              apartments and exceptional properties with DreamDwell.
            </p>

            {/* SEARCH BOX */}
            <div className="mt-10 max-w-3xl rounded-2xl bg-white p-3 shadow-2xl">

              <div className="mb-3 flex gap-2 px-2 pt-1">
                {["Sale", "Rent"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setListingType(type)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      listingType === type
                        ? "bg-[#171717] text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {type === "Sale" ? "Buy" : "Rent"}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <MapPin size={20} className="text-[#72B990]" />

                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500">
                      Location
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city name"
                      className="w-full bg-transparent text-sm text-[#171717] outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#B9E4C8] px-8 py-4 text-sm font-bold text-[#171717] transition hover:bg-[#9ED9B2]"
                >
                  <Search size={19} />
                  Search Properties
                </button>
              </form>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
              <span>✓ Verified property listings</span>
              <span>✓ Easy property discovery</span>
              <span>✓ Trusted experience</span>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-360 px-5 py-12 lg:px-12">

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#72B990]">
              Explore possibilities
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-4xl">
              Find the right space
            </h2>

            <p className="mt-3 text-gray-500">
              Explore properties that match your lifestyle.
            </p>
          </div>

          <Link
            to="/properties"
            className="flex items-center gap-2 text-sm font-semibold hover:text-[#72B990]"
          >
            View all <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                to={`/properties?propertyType=${category.name}`}
                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-7 transition hover:-translate-y-1 hover:border-[#B9E4C8] hover:shadow-lg"
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {category.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#72B990]">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9F5ED] transition group-hover:bg-[#B9E4C8]">
                  <Icon size={30} strokeWidth={1.5} />
                </div>
              </Link>
            );
          })}

        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="mx-auto max-w-360 px-5 py-16 lg:px-12">

        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#72B990]">
              Handpicked for you
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Featured properties
            </h2>

            <p className="mt-3 text-gray-500">
              Discover some of the latest properties on DreamDwell.
            </p>
          </div>

          <Link
            to="/properties"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#72B990]"
          >
            Explore all properties <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-107.5 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <p className="text-gray-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-[#171717] px-5 py-2 text-white"
            >
              Retry
            </button>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold">
              No properties available yet
            </h3>

            <p className="mt-2 text-gray-500">
              Check back soon for new listings.
            </p>
          </div>
        )}

      </section>

      {/* WHY DREAMDWELL */}
      <section className="mx-auto max-w-360 px-5 py-16 lg:px-12">

        <div className="rounded-[28px] bg-[#171717] px-7 py-14 text-white sm:px-12">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#B9E4C8]">
              The DreamDwell difference
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              A better way to find your place.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-400">
              Finding the right property should feel exciting,
              not complicated. We're here to make the journey easier.
            </p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3">

            <div className="text-center">
              <ShieldCheck
                size={34}
                className="mx-auto text-[#B9E4C8]"
              />

              <h3 className="mt-4 font-semibold">
                Trusted Listings
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Explore property information with confidence.
              </p>
            </div>

            <div className="text-center">
              <KeyRound
                size={34}
                className="mx-auto text-[#B9E4C8]"
              />

              <h3 className="mt-4 font-semibold">
                Simple Discovery
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Find properties that match your preferences.
              </p>
            </div>

            <div className="text-center">
              <Headset
                size={34}
                className="mx-auto text-[#B9E4C8]"
              />

              <h3 className="mt-4 font-semibold">
                Easy Communication
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Connect with property owners easily.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-360 px-5 pb-20 pt-8 lg:px-12">
        <div className="flex flex-col items-center justify-between text-white gap-6 rounded-2xl bg-[#B9E4C8] px-8 py-12 sm:flex-row sm:px-14">

          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#171717]">
              Your dream home is waiting.
            </h2>

            <p className="mt-2 text-sm text-gray-700">
              Start exploring properties with DreamDwell today.
            </p>
          </div>

          <Link
            to="/properties"
            className="flex items-center gap-2 rounded-xl bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition hover:bg-black/70"
          >
            Explore properties <ArrowRight size={18} color="white" />
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;
