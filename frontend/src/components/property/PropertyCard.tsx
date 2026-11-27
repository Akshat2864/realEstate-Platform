
import { Link } from "react-router";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Heart,
} from "lucide-react";
import type { Property } from "../../types/property.types";

interface PropertyCardProps {
  property: Property;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const PropertyCard = ({ property }: PropertyCardProps) => {
  const image = property.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-0.75 hover:shadow-l">

      <div className="relative overflow-hidden">
        <Link to={`/properties/${property._id}`}>
          <img
            src={image || "https://placehold.co/600x400?text=DreamDwell"}
            alt={property.title}
            className="h-60 w-full object-cover transition duration-500 "
          />
        </Link>

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold">
          For {property.listingType}
        </span>

        <button
          type="button"
          aria-label="Add to favorites"
          onClick={() => alert("Favorites coming soon!")}
          className="absolute right-4 top-4 rounded-full bg-white p-2 transition hover:bg-[#B9E4C8]"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={15} />
          {property.location.city}, {property.location.state}
        </div>

        <Link to={`/properties/${property._id}`}>
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-[#171717] ">
            {property.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-2 min-h-10 text-sm text-gray-500">
          {property.description}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <BedDouble size={17} />
            {property.bedrooms} Beds
          </span>

          <span className="flex items-center gap-1.5">
            <Bath size={17} />
            {property.bathrooms} Baths
          </span>

          <span className="flex items-center gap-1.5">
            <Maximize size={16} />
            {property.area} sq.ft.
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400">Starting price</p>
            <p className="text-lg font-bold text-[#171717]">
              {formatPrice(property.price)}
            </p>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="rounded-lg bg-[#B9E4C8] px-4 py-2.5 text-sm font-semibold text-[#171717] transition hover:bg-[#9ED9B2]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
