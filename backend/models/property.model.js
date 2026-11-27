
import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "House", "Plot", "Commercial"],
      required: true,
    },

    listingType: {
      type: String,
      enum: ["Sale", "Rent"],
      required: true,
    },

    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String, required: true },
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

   
images: {
  type: [
    {
      url: {
        type: String,
        required: true,
      },
      fileId: {
        type: String,
        required: true,
      },
    },
  ],
  validate: {
    validator: (images) => images.length <= 4,
    message: "Maximum 4 images are allowed",
  },
  default: [],
},


    amenities: {
      type: [String],
      default: [],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
