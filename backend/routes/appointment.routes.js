import express from "express";
import { cancelAppointment, createAppointment, getMyAppointments, getReceivedAppointments } from "../controllers/appointment.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createAppointment);

router.get("/my", protect, getMyAppointments);

router.get("/received", protect, getReceivedAppointments);

router.patch("/:id/cancel", protect, cancelAppointment);


export default router;
