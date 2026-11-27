
import { useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { PropertyImage } from "../../types/property.types";

interface Props {
  images: PropertyImage[];
  title: string;
}

const ImageGallery = ({ images, title }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const galleryImages = images?.filter((image) => image.url) || [];

  if (!galleryImages.length) {
    return (
      <div className="flex h-87.5 items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
        <Images size={40} />
        <span className="ml-2">No images available</span>
      </div>
    );
  }

  const changeImage = (direction: number) => {
    setActiveIndex((current) =>
      (current + direction + galleryImages.length) % galleryImages.length
    );
  };

  return (
    <div className="space-y-3">

      <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={galleryImages[activeIndex].url}
          alt={`${title} - Image ${activeIndex + 1}`}
          className="h-75 w-full object-cover sm:h-112.5 lg:h-137.5"
        />

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() => changeImage(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => changeImage(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <span className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-3 py-2 text-xs text-white">
          {activeIndex + 1} / {galleryImages.length}
        </span>
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={image.fileId || index}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`shrink-0 overflow-hidden rounded-xl border-2 ${
                activeIndex === index
                  ? "border-[#79BD98]"
                  : "border-transparent"
              }`}
            >
              <img
                src={image.url}
                alt={`${title} thumbnail ${index + 1}`}
                className="h-20 w-28 object-cover sm:h-24 sm:w-36"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default ImageGallery;
