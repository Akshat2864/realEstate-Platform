
export interface PropertyImage {
  url: string;
  fileId: string;
}

export interface PropertyLocation {
  city: string;
  state: string;
  address: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  listingType: string;
  location: PropertyLocation;
  area: number;
  bedrooms: number;
  bathrooms: number;
  images: PropertyImage[];
  amenities: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  listingType?: string;
  city?: string;
  state?: string;
  minArea?: number;
  maxArea?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PropertyResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  properties: Property[];
}
