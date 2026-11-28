
import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";
import Property from "../models/property.model.js";

export const createAppointment = async (req, res) => {
  try {
    const { propertyId, startAt, message } = req.body;

    if (!propertyId || !startAt) {
      return res.status(400).json({
        success: false,
        message: "Property and appointment time are required",
      });
    }

    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Prevent users from booking their own property
    if (property.owner.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own property",
      });
    }

    const requestedStart = new Date(startAt);

    if (Number.isNaN(requestedStart.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    const requestedEnd = new Date(
      requestedStart.getTime() + 2 * 60 * 60 * 1000
    );

    if (requestedStart <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment must be scheduled in the future",
      });
    }

    // Check overlapping confirmed appointments for this owner
    const overlappingAppointment = await Appointment.findOne({
      owner: property.owner,
      status: "confirmed",
      startAt: { $lt: requestedEnd },
      endAt: { $gt: requestedStart },
    });

    if (overlappingAppointment) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      property: property._id,
      user: req.user.id,
      owner: property.owner,
      startAt: requestedStart,
      endAt: requestedEnd,
      message: message || "",
      status: "confirmed",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment confirmed successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
};


export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user.id,
    })
      .populate("property", "title price location images")
      .populate("owner", "name email")
      .sort({ startAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get my appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

export const getReceivedAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      owner: req.user.id,
    })
      .populate("property", "title price location images")
      .populate("user", "name email")
      .sort({ startAt: -1 });

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get received appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment requests",
    });
  }
};


export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed appointments can be cancelled",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};
