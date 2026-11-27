
import Property from "../models/property.model.js";
import {
  uploadImage,
  deleteImage,
} from "../services/imagekit.service.js";

import mongoose from "mongoose";

export const createProperty = async (req, res) => {
  const uploadedImages = [];

  try {
    const {
      title,
      description,
      price,
      propertyType,
      listingType,
      location,
      area,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !propertyType ||
      !listingType ||
      !location ||
      !area
    ) {
      return res.status(400).json({
        success: false,
        message: "Required property fields are missing",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one property image is required",
      });
    }

    // Upload images to ImageKit
    for (const file of req.files) {
      const image = await uploadImage(file);
      uploadedImages.push(image);
    }

    const parsedLocation =
      typeof location === "string"
        ? JSON.parse(location)
        : location;

    const parsedAmenities =
      typeof amenities === "string"
        ? JSON.parse(amenities)
        : amenities || [];

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      propertyType,
      listingType,
      location: parsedLocation,
      area: Number(area),
      bedrooms: Number(bedrooms || 0),
      bathrooms: Number(bathrooms || 0),
      amenities: parsedAmenities,
      images: uploadedImages,
      owner: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });

  } catch (error) {
    // Clean up uploaded images if database creation fails
    await Promise.allSettled(
      uploadedImages.map((image) => deleteImage(image.fileId))
    );

    console.error("Create property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create property",
    });
  }
};




export const getAllProperties = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      propertyType,
      listingType,
      city,
      state,
      minArea,
      maxArea,
      page = 1,
      limit = 10,
      sort = "newest",
    } = req.query;

    const filter = {};

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Property type filter
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Listing type filter
    if (listingType) {
      filter.listingType = listingType;
    }

    // Location filters
    if (city) {
      filter["location.city"] = {
        $regex: city,
        $options: "i",
      };
    }

    if (state) {
      filter["location.state"] = {
        $regex: state,
        $options: "i",
      };
    }

    // Area filter
    if (minArea !== undefined || maxArea !== undefined) {
      filter.area = {};

      if (minArea !== undefined) {
        filter.area.$gte = Number(minArea);
      }

      if (maxArea !== undefined) {
        filter.area.$lte = Number(maxArea);
      }
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
    };

    const sortBy = sortOptions[sort] || sortOptions.newest;

    // Pagination
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(
      50,
      Math.max(1, Number(limit) || 10)
    );

    const skip = (pageNumber - 1) * limitNumber;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("owner", "name email")
        .sort(sortBy)
        .skip(skip)
        .limit(limitNumber),

      Property.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      properties,
    });

  } catch (error) {
    console.error("Filter properties error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};




export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id)
      .populate("owner", "name email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });

  } catch (error) {
    console.error("Get property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property",
    });
  }
};


export const updateProperty = async (req, res) => {
  const uploadedImages = [];

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Find property belonging to logged-in user
    const property = await Property.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or unauthorized",
      });
    }

    const {
      title,
      description,
      price,
      propertyType,
      listingType,
      location,
      area,
      bedrooms,
      bathrooms,
      amenities,
    } = req.body;

    const updates = {};

    // Allow only explicitly supported fields
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;

    if (price !== undefined) {
      if (price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid price",
        });
      }

      updates.price = Number(price);
    }

    if (propertyType !== undefined) {
      updates.propertyType = propertyType;
    }

    if (listingType !== undefined) {
      updates.listingType = listingType;
    }

    if (location !== undefined) {
      updates.location =
        typeof location === "string"
          ? JSON.parse(location)
          : location;
    }

    if (area !== undefined) {
      if (area === "" || !Number.isFinite(Number(area)) || Number(area) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid property area",
        });
      }

      updates.area = Number(area);
    }

    if (bedrooms !== undefined) {
      updates.bedrooms = Number(bedrooms);
    }

    if (bathrooms !== undefined) {
      updates.bathrooms = Number(bathrooms);
    }

    if (amenities !== undefined) {
      updates.amenities =
        typeof amenities === "string"
          ? JSON.parse(amenities)
          : amenities;
    }

    // Upload new images if provided
    if (req.files?.length > 0) {
      const newImages = [];

      for (const file of req.files) {
        const image = await uploadImage(file);
        uploadedImages.push(image);
        newImages.push(image);
      }

      // Replace the existing gallery
      updates.images = newImages;
    }

    const oldImages = property.images;

    Object.assign(property, updates);

    await property.save();

    // Delete old images only after DB update succeeds
    if (updates.images) {
      const deletionResults = await Promise.allSettled(
        oldImages.map((image) => deleteImage(image.fileId))
      );

      deletionResults.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Old ImageKit image cleanup failed:", result.reason);
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property,
    });

  } catch (error) {
    // Clean up newly uploaded images if update fails
    await Promise.allSettled(
      uploadedImages.map((image) => deleteImage(image.fileId))
    );

    console.error("Update property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update property",
    });
  }
};



export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Find only the logged-in user's property
    const property = await Property.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or unauthorized",
      });
    }

    // Delete property from MongoDB first
    await Property.deleteOne({
      _id: property._id,
      owner: req.user.id,
    });

    // Delete associated ImageKit images
    const deletionResults = await Promise.allSettled(
      property.images.map((image) => deleteImage(image.fileId))
    );

    deletionResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error("ImageKit deletion failed:", result.reason);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });

  } catch (error) {
    console.error("Delete property error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete property",
    });
  }
};


export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });

  } catch (error) {
    console.error("My properties error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your properties",
    });
  }
};
