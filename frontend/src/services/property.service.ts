
import api from "./api";
import type {
  Property,
  PropertyFilters,
  PropertyResponse,
} from "../types/property.types";

export const getAllProperties = async (
  filters: PropertyFilters = {}
): Promise<PropertyResponse> => {
  try {
    const response = await api.get("/properties", {
      params: filters,
    });

    return response.data;
  } catch (error) {
    console.error("Get properties error:", error);
    throw error;
  }
};

export const getPropertyById = async (
  id: string
): Promise<Property> => {
  try {
    const response = await api.get(`/properties/${id}`);

    return response.data.property;
  } catch (error) {
    console.error("Get property error:", error);
    throw error;
  }
};

export const getMyProperties = async (): Promise<Property[]> => {
  try {
    const response = await api.get("/properties/my-listings");

    return response.data.properties;
  } catch (error) {
    console.error("Get my properties error:", error);
    throw error;
  }
};
