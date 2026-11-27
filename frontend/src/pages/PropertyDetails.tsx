
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  CheckCircle2,
  ArrowLeft,
  Mail,
  UserRound,
} from "lucide-react";

import { RiCalendar2Line } from "@remixicon/react";


import ImageGallery from "../components/property/ImageGallery";
import { getPropertyById } from "../services/property.service";

import type { Property } from "../types/property.types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError("Invalid property ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Property details error:", err);
        setError("Unable to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-360 animate-pulse px-5 py-12 lg:px-12">
        <div className="h-112.5 rounded-2xl bg-gray-200" />
        <div className="mt-8 h-10 w-1/2 rounded bg-gray-200" />
        <div className="mt-4 h-5 w-1/3 rounded bg-gray-200" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="px-5 py-24 text-center">
        <h2 className="text-2xl font-semibold">
          Property not found
        </h2>

        <p className="mt-3 text-gray-500">
          {error || "This property may have been removed."}
        </p>

        <Link
          to="/properties"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#B9E4C8] px-5 py-3 font-semibold"
        >
          <ArrowLeft size={17} />
          Back to properties
        </Link>
      </div>
    );
  }

  const ownerEmail = property.owner?.email;

  return (
    <div className="min-h-screen bg-[#F7F7F5]">

      <div className="mx-auto max-w-360 px-5 pb-16 pt-8 lg:px-12">

        {/* BREADCRUMB */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#72B990]">
            Home
          </Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-[#72B990]">
            Properties
          </Link>
          <span>/</span>
          <span className="max-w-45 truncate text-[#171717]">
            {property.title}
          </span>
        </div>

        {/* IMAGE GALLERY */}
        <ImageGallery
          images={property.images}
          title={property.title}
        />

        {/* PROPERTY INFORMATION */}
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">

          <div>

            {/* TITLE AND LOCATION */}
            <div className="border-b border-gray-200 pb-7">

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#E4F3E9] px-4 py-1.5 text-xs font-semibold text-[#39865A]">
                  For {property.listingType}
                </span>

                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-600">
                  {property.propertyType}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                {property.title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={17} className="text-[#72B990]" />
                {property.location.address}, {property.location.city},{" "}
                {property.location.state}
              </p>

              <p className="mt-5 text-2xl font-bold">
                {formatPrice(property.price)}
              </p>

            </div>

            {/* PROPERTY SPECIFICATIONS */}
            <section className="border-b border-gray-200 py-8">

              <h2 className="mb-6 text-xl font-semibold">
                Property overview
              </h2>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">

                <div className="flex items-center gap-3 rounded-xl bg-white p-4">
                  <BedDouble className="text-[#72B990]" size={23} />
                  <div>
                    <p className="text-lg font-semibold">
                      {property.bedrooms}
                    </p>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white p-4">
                  <Bath className="text-[#72B990]" size={23} />
                  <div>
                    <p className="text-lg font-semibold">
                      {property.bathrooms}
                    </p>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white p-4">
                  <Maximize className="text-[#72B990]" size={23} />
                  <div>
                    <p className="text-lg font-semibold">
                      {property.area}
                    </p>
                    <p className="text-xs text-gray-500">Sq. Ft.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="border-b border-gray-200 py-8">

              <h2 className="mb-4 text-xl font-semibold">
                About this property
              </h2>

              <p className="whitespace-pre-line text-sm leading-8 text-gray-600">
                {property.description}
              </p>

            </section>

            {/* AMENITIES */}
            <section className="py-8">

              <h2 className="mb-6 text-xl font-semibold">
                Amenities and features
              </h2>

              {property.amenities?.length ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-[#72B990]"
                      />
                      {amenity}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No amenities listed.
                </p>
              )}

            </section>

          </div>

          {/* OWNER CONTACT CARD */}
          <aside className="lg:sticky lg:top-28">

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <p className="text-sm text-gray-500">
                Property price
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {formatPrice(property.price)}
              </h2>

              <div className="my-6 border-t border-gray-100" />

              <h3 className="font-semibold">
                Listed by
              </h3>

              <div className="mt-5 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F5ED]">
                  <UserRound size={23} className="text-[#39865A]" />
                </div>

                <div>
                  <p className="font-semibold">
                    {property.owner?.name || "Property Owner"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Property Owner
                  </p>
                </div>

              </div>

              {ownerEmail ? (
                <a
                  href={`mailto:${ownerEmail}?subject=${encodeURIComponent(
                    `Inquiry about ${property.title}`
                  )}`}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B9E4C8] py-3.5 text-sm font-semibold transition hover:bg-[#9ED9B2]"
                >
                  <Mail size={18} />
                  Contact Owner
                </a>
              ) : (
                <button
                  disabled
                  className="mt-7 w-full cursor-not-allowed rounded-xl bg-gray-200 py-3.5 text-sm font-semibold text-gray-500"
                >
                  Contact unavailable
                </button>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Contact the property owner to learn more about this listing.
              </p>

            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
