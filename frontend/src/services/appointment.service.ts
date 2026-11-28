
import api from "./api";

import type {
  Appointment,
  AppointmentResponse,
  AppointmentsResponse,
  CreateAppointmentPayload,
} from "../types/appointment.types";

// Book a property visit
export const bookAppointment = async (
  data: CreateAppointmentPayload
): Promise<Appointment> => {
  try {
    const response = await api.post<AppointmentResponse>(
      "/appointments",
      data
    );

    return response.data.appointment;
  } catch (error) {
    console.error("Book appointment error:", error);
    throw error;
  }
};

// Appointments booked by the logged-in user
export const getMyAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get<AppointmentsResponse>(
      "/appointments/my"
    );

    return response.data.appointments;
  } catch (error) {
    console.error("Get my appointments error:", error);
    throw error;
  }
};

// Appointments received for owned properties
export const getReceivedAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get<AppointmentsResponse>(
      "/appointments/received"
    );

    return response.data.appointments;
  } catch (error) {
    console.error("Get received appointments error:", error);
    throw error;
  }
};

// Cancel a confirmed appointment
export const cancelAppointment = async (
  id: string
): Promise<Appointment> => {
  try {
    const response = await api.patch<AppointmentResponse>(
      `/appointments/${id}/cancel`
    );

    return response.data.appointment;
  } catch (error) {
    console.error("Cancel appointment error:", error);
    throw error;
  }
};
