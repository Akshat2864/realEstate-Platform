
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



export const createProperty = async (formData: FormData): Promise<void> => {
  try {
    await api.post("/properties", formData);
  } catch (error) {
    console.error("Create property error:", error);
    throw error;
  }
};



export const updateProperty = async (
  id: string,
  formData: FormData
): Promise<Property> => {
  try {
    const response = await api.put(`/properties/${id}`, formData);
    return response.data.property;
  } catch (error) {
    console.error("Update property error:", error);
    throw error;
  }
};


export const deleteProperty = async (id: string): Promise<void> => {
  try {
    await api.delete(`/properties/${id}`);
  } catch (error) {
    console.error("Delete property error:", error);
    throw error;
  }
};
