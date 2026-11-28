
export type AppointmentStatus =
  | "confirmed"
  | "cancelled"
  | "completed";

export interface AppointmentUser {
  _id: string;
  name: string;
  email: string;
}

export interface AppointmentProperty {
  _id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  images: {
    url: string;
    fileId: string;
  }[];
}

export interface Appointment {
  _id: string;
  property: AppointmentProperty;
  user: string | AppointmentUser;
  owner: string | AppointmentUser;
  startAt: string;
  endAt: string;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  propertyId: string;
  startAt: string;
  message?: string;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  appointment: Appointment;
}

export interface AppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
}
