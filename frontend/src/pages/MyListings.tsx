import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Home, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { getMyProperties } from "../services/property.service";
import type { Property } from "../types/property.types";
import PropertyCard from "../components/property/PropertyCard";
import Loader from "../components/common/Loader";

import { deleteProperty } from "../services/property.service";

const MyListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const data = await getMyProperties();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await deleteProperty(id);

      setProperties((prev) => prev.filter((property) => property._id !== id));

      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Delete property failed:", error);
      toast.error("Failed to delete property");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row text-white sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Listings</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage all your property listings.
          </p>
        </div>

        <Link
          to="/dashboard/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white hover:bg-[#333] transition"
        >
          <Plus size={18} />
          Add Property
        </Link>
      </div>

      <div className="text-sm text-neutral-500">
        {properties.length}{" "}
        {properties.length === 1 ? "property" : "properties"}
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center">
          <Home size={42} className="mx-auto text-neutral-400" />

          <h2 className="mt-4 text-lg font-semibold text-neutral-800">
            No listings yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Start by adding your first property.
          </p>

          <Link
            to="/dashboard/create"
            className="inline-block mt-5 rounded-lg bg-[#B9E4C8] px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-[#a5d9b7] transition"
          >
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="space-y-3">
              <PropertyCard property={property} />

              <div className="flex gap-3 text-white">
                <Link
                  to={`/dashboard/edit/${property._id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#171717] px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  <Pencil size={16} />
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(property._id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
