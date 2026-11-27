
import express from "express";

import {
  createProperty,
  getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getMyProperties,
} from "../controllers/property.controller.js";

import protect from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getAllProperties);

router.get("/my-listings", protect, getMyProperties);


router.get("/:id", getPropertyById);

router.post(
  "/",
  protect,
  upload.array("images", 4),
  createProperty
);

router.put(
  "/:id",
  protect,
  upload.array("images", 4),
  updateProperty
);

router.delete("/:id", protect, deleteProperty);

export default router;
