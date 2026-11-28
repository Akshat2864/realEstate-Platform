
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { ImagePlus, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { createProperty } from "../services/property.service";

const initialForm = {
  title: "",
  description: "",
  price: "",
  propertyType: "Apartment",
  listingType: "Sale",
  address: "",
  city: "",
  state: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
};

const amenityOptions = [
  "Parking",
  "Swimming Pool",
  "Gym",
  "Garden",
  "Security",
  "Lift",
  "Power Backup",
  "Clubhouse",
  "Air Conditioning",
  "Furnished",
];

const CreateProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (images.length + selectedFiles.length > 4) {
      toast.error("You can upload a maximum of 4 images");
      e.target.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = selectedFiles.find(
      (file) => !validTypes.includes(file.type) || file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      toast.error("Use JPEG, PNG or WEBP images up to 5MB each");
      e.target.value = "";
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one property image");
      return;
    }

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("propertyType", form.propertyType);
      formData.append("listingType", form.listingType);

      formData.append(
        "location",
        JSON.stringify({
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
        })
      );

      formData.append("area", form.area);
      formData.append("bedrooms", form.bedrooms);
      formData.append("bathrooms", form.bathrooms);
      formData.append("amenities", JSON.stringify(amenities));

      images.forEach((image) => {
        formData.append("images", image);
      });

      await createProperty(formData);

      toast.success("Property listed successfully!");
      navigate("/dashboard/listings");
    } catch (error) {
      console.error("Create property failed:", error);
      toast.error("Failed to create property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#79BD98] focus:ring-2 focus:ring-[#B9E4C8]/40";

  const labelClass = "mb-2 block text-sm font-medium text-neutral-700";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() => navigate("/dashboard/listings")}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft size={17} />
        Back to listings
      </button>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Add New Property
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Share your property with people looking for their dream home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic information */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-lg font-semibold text-neutral-900">
            Basic Information
          </h2>

          <div>
            <label className={labelClass}>Property Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Luxury 3BHK Apartment"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              rows={5}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Property Type *</label>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Plot</option>
                <option>Commercial</option>
                <option>Flat</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Listing Type *</label>
              <select
                name="listingType"
                value={form.listingType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 7500000"
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Area (sq. ft.) *</label>
              <input
                type="number"
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="e.g. 1500"
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                min="0"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                min="0"
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-lg font-semibold text-neutral-900">
            Property Location
          </h2>

          <div>
            <label className={labelClass}>Full Address *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Street, locality, landmark..."
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>State *</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Amenities
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Select all amenities available at your property.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amenityOptions.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 text-sm text-neutral-700"
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="accent-[#79BD98]"
                />
                {amenity}
              </label>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Property Images *
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Upload up to 4 images. JPEG, PNG or WEBP, maximum 5MB each.
            </p>
          </div>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 p-8 text-center hover:border-[#79BD98] transition">
            <ImagePlus size={32} className="text-neutral-400" />
            <span className="mt-3 text-sm font-medium text-neutral-700">
              Click to upload images
            </span>
            <span className="mt-1 text-xs text-neutral-400">
              {images.length}/4 images selected
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={images.length >= 4}
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={`${image.name}-${index}`} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property preview ${index + 1}`}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-neutral-900 p-1 text-white"
                    aria-label="Remove image"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/listings")}
            className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#171717] px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Publish Property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
