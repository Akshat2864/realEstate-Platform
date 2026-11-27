
import { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { PropertyFilters as Filters } from "../../types/property.types";

interface Props {
  filters: Filters;
  onApply: (filters: Filters) => void;
}

const PropertyFilters = ({ filters, onApply }: Props) => {
  const [draft, setDraft] = useState<Filters>(filters);

  useEffect(() => {
  setDraft(filters);
}, [filters]);

 const update = (key: keyof Filters, value: string) => {
  setDraft((prev) => ({
    ...prev,
    [key]: [
      "minPrice",
      "maxPrice",
      "minArea",
      "maxArea",
    ].includes(key)
      ? value === "" ? undefined : Number(value)
      : value,
  }));
};

  const reset = () => {
    const empty: Filters = { page: 1, limit: 9, sort: "newest" };
    setDraft(empty);
    onApply(empty);
  };

  const categories = [
    "House",
    "Apartment",
    "Villa",
    "Plot",
    "Commercial",
    "Flat",
  ];

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#79BD98]";

  return (
    <aside className="rounded-2xl border border-gray-100 bg-white p-5">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal size={18} />
          Filters
        </h2>

        <button
          onClick={reset}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#65A982]"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="space-y-6">

        <section>
          <h3 className="mb-3 text-sm font-semibold">Listing type</h3>

          <div className="flex gap-2">
            {["Sale", "Rent"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  update(
                    "listingType",
                    draft.listingType === type ? "" : type
                  )
                }
                className={`flex-1 rounded-lg border py-2 text-sm ${
                  draft.listingType === type
                    ? "border-[#79BD98] bg-[#E9F5ED] font-semibold"
                    : "border-gray-200"
                }`}
              >
                {type === "Sale" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Property type</h3>

          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={draft.propertyType === category}
                  onChange={() =>
                    update(
                      "propertyType",
                      draft.propertyType === category ? "" : category
                    )
                  }
                  className="accent-[#79BD98]"
                />
                {category}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Location</h3>

          <input
            type="text"
            placeholder="Enter city"
            value={draft.city || ""}
            onChange={(e) => update("city", e.target.value)}
            className={inputClass}
          />
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Price range (₹)</h3>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Minimum"
              value={draft.minPrice ?? ""}
              onChange={(e) => update("minPrice", e.target.value)}
              className={inputClass}
            />

            <input
              type="number"
              placeholder="Maximum"
              value={draft.maxPrice ?? ""}
              onChange={(e) => update("maxPrice", e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold">Area (sq. ft.)</h3>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Minimum"
              value={draft.minArea ?? ""}
              onChange={(e) => update("minArea", e.target.value)}
              className={inputClass}
            />

            <input
              type="number"
              placeholder="Maximum"
              value={draft.maxArea ?? ""}
              onChange={(e) => update("maxArea", e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        <button
          onClick={() => onApply({ ...draft, page: 1 })}
          className="w-full rounded-lg bg-[#B9E4C8] py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#9ED9B2]"
        >
          Apply Filters
        </button>

      </div>
    </aside>
  );
};

export default PropertyFilters;
