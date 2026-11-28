
import { useEffect, useState } from "react";
import { CalendarDays, Clock3, MapPin, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

import { getReceivedAppointments } from "../services/appointment.service";
import type { Appointment, AppointmentUser } from "../types/appointment.types";
import Loader from "../components/common/Loader";

const ReceivedAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getReceivedAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Fetch received appointments error:", error);
        toast.error("Failed to load appointment requests");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  if (loading) return <Loader />;

  const confirmed = appointments.filter(
    (item) => item.status === "confirmed"
  );

  const cancelled = appointments.filter(
    (item) => item.status === "cancelled"
  );

  const completed = appointments.filter(
    (item) => item.status === "completed"
  );

  const renderAppointment = (appointment: Appointment) => {
    const visitor = appointment.user as AppointmentUser;

    return (
      <div
        key={appointment._id}
        className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={
              appointment.property?.images?.[0]?.url ||
              "https://placehold.co/600x400?text=Property"
            }
            alt={appointment.property?.title || "Property"}
            className="h-32 w-full rounded-xl object-cover sm:w-40"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {appointment.property?.title || "Property unavailable"}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                  <MapPin size={15} />
                  {appointment.property?.location?.city},{" "}
                  {appointment.property?.location?.state}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  appointment.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {formatDate(appointment.startAt)}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={16} />
                {formatTime(appointment.startAt)} –{" "}
                {formatTime(appointment.endAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4 space-y-3">
          <h4 className="text-sm font-semibold text-neutral-800">
            Visitor Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <User size={16} />
              {visitor?.name || "Unknown visitor"}
            </div>

            <div className="flex items-center gap-2 text-neutral-600">
              <Mail size={16} />
              {visitor?.email || "Email unavailable"}
            </div>
          </div>

          {appointment.message && (
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="text-xs font-medium text-neutral-500">
                Visitor's message
              </p>
              <p className="mt-1 text-sm text-neutral-700">
                {appointment.message}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Received Appointments
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          View visitors who have booked your properties.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Confirmed</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {confirmed.length}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-neutral-800">
            {completed.length}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Cancelled</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {cancelled.length}
          </p>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <CalendarDays
            size={40}
            className="mx-auto text-neutral-400"
          />
          <h3 className="mt-4 font-semibold text-neutral-800">
            No appointments received
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            Visitors who book your properties will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {appointments.map(renderAppointment)}
        </div>
      )}
    </div>
  );
};

export default ReceivedAppointments;
