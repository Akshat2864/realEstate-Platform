
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import {
  Grid2X2,
  List,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PropertyCard from "../components/property/PropertyCard";
import PropertyFilters from "../components/property/PropertyFilters";

import { getAllProperties } from "../services/property.service";

import type {
  Property,
  PropertyFilters as Filters,
} from "../types/property.types";

const LIMIT = 9;

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [view, setView] = useState<"grid" | "list">("grid");

  const filters: Filters = {
    listingType: searchParams.get("listingType") || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    city: searchParams.get("city") || undefined,
    minPrice: searchParams.has("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.has("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    minArea: searchParams.has("minArea")
      ? Number(searchParams.get("minArea"))
      : undefined,
    maxArea: searchParams.has("maxArea")
      ? Number(searchParams.get("maxArea"))
      : undefined,
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page") || 1),
    limit: LIMIT,
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllProperties(filters);

        setProperties(data.properties);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Properties fetch error:", err);
        setError("Unable to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  const applyFilters = (newFilters: Filters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.set(key, String(value));
      }
    });

    params.set("page", "1");
    setSearchParams(params);
  };

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.set("page", "1");
    setSearchParams(params);
  };

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5]">

      {/* PAGE HEADER */}
      <section className="mx-auto max-w-360 px-5 pb-8 pt-12 lg:px-12">

        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#72B990]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#171717]">Properties</span>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#72B990]">
          Find your perfect space
        </p>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Explore properties
        </h1>

        <p className="mt-3 text-gray-500">
          Discover homes and spaces that fit your lifestyle.
        </p>

      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-360 px-5 pb-16 lg:px-12">

        <div className="grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">

          {/* FILTER SIDEBAR */}
          <div className="lg:sticky lg:top-24">
            <PropertyFilters
              filters={filters}
              onApply={applyFilters}
            />
          </div>

          {/* PROPERTY RESULTS */}
          <div className="min-w-0">

            {/* TOOLBAR */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4">

              <div>
                <h2 className="font-semibold">
                  Search results
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {total} properties found
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-gray-500" />

                  <select
                    value={filters.sort}
                    onChange={(e) => updateSort(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#79BD98]"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`rounded-md p-2 ${
                      view === "grid"
                        ? "bg-[#E9F5ED] text-[#39865A]"
                        : "text-gray-500"
                    }`}
                  >
                    <Grid2X2 size={18} />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`rounded-md p-2 ${
                      view === "list"
                        ? "bg-[#E9F5ED] text-[#39865A]"
                        : "text-gray-500"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>

              </div>
            </div>

            {/* ACTIVE FILTERS */}
            <div className="mb-5 flex flex-wrap items-center gap-2">

              {Object.entries(filters)
                .filter(([key, value]) =>
                  value !== undefined &&
                  value !== "" &&
                  !["page", "limit", "sort"].includes(key)
                )
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full bg-[#E9F5ED] px-3 py-1.5 text-xs font-medium text-[#39865A]"
                  >
                    {key}: {String(value)}
                  </span>
                ))}

              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-gray-500 underline hover:text-black"
              >
                Clear all
              </button>

            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-105 animate-pulse rounded-2xl bg-gray-200"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-white p-12 text-center">
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={() => setSearchParams(new URLSearchParams(searchParams))}
                  className="mt-4 rounded-lg bg-[#171717] px-5 py-2 text-white"
                >
                  Retry
                </button>
              </div>
            ) : properties.length > 0 ? (

              <>
                <div
                  className={
                    view === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "flex flex-col gap-5"
                  }
                >
                  {properties.map((property) => (
                    <div
                      key={property._id}
                      className={view === "list" ? "md:max-w-full" : ""}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">

                    <button
                      disabled={filters.page! <= 1}
                      onClick={() => changePage(filters.page! - 1)}
                      className="rounded-lg border border-gray-200 bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {filters.page} of {totalPages}
                    </span>

                    <button
                      disabled={filters.page! >= totalPages}
                      onClick={() => changePage(filters.page! + 1)}
                      className="rounded-lg border border-gray-200 bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight size={20} />
                    </button>

                  </div>
                )}
              </>

            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center">

                <Search size={40} className="mx-auto text-gray-300" />

                <h3 className="mt-5 text-xl font-semibold">
                  No properties found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your filters to find more properties.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-lg bg-[#B9E4C8] px-6 py-3 text-sm font-semibold"
                >
                  Clear filters
                </button>

              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;
