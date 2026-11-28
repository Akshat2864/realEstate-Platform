
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CalendarDays, Clock3, MapPin, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  cancelAppointment,
  getMyAppointments,
} from "../services/appointment.service";

import type { Appointment } from "../types/appointment.types";
import Loader from "../components/common/Loader";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Fetch appointments error:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);

      await cancelAppointment(id);

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

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

  const isFuture = (date: string) => new Date(date) > new Date();

  if (loading) return <Loader />;

  const upcomingAppointments = appointments.filter(
    (item) => item.status === "confirmed" && isFuture(item.startAt)
  );

  const pastAppointments = appointments.filter(
    (item) => !upcomingAppointments.includes(item)
  );

  const statusStyles = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-neutral-100 text-neutral-600",
  };

  const renderAppointment = (appointment: Appointment) => (
    <div
      key={appointment._id}
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
        <img
          src={
            appointment.property?.images?.[0]?.url ||
            "https://placehold.co/600x400?text=Property"
          }
          alt={appointment.property?.title || "Property"}
          className="h-48 w-full object-cover sm:h-full"
        />

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
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
                statusStyles[appointment.status]
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <CalendarDays size={17} />
              {formatDate(appointment.startAt)}
            </div>

            <div className="flex items-center gap-2 text-neutral-600">
              <Clock3 size={17} />
              {formatTime(appointment.startAt)} –{" "}
              {formatTime(appointment.endAt)}
            </div>
          </div>

          <p className="text-xs text-neutral-500">
            Duration: 2 hours
          </p>

          {appointment.message && (
            <p className="rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
              {appointment.message}
            </p>
          )}

          {appointment.status === "confirmed" &&
            isFuture(appointment.startAt) && (
              <button
                type="button"
                disabled={cancellingId === appointment._id}
                onClick={() => handleCancel(appointment._id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <XCircle size={16} />
                {cancellingId === appointment._id
                  ? "Cancelling..."
                  : "Cancel Appointment"}
              </button>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          My Appointments
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your property visits and bookings.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Upcoming Visits
          </h2>
          <p className="text-sm text-neutral-500">
            {upcomingAppointments.length} confirmed upcoming visits
          </p>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <CalendarDays
              size={36}
              className="mx-auto text-neutral-400"
            />
            <h3 className="mt-3 font-semibold text-neutral-800">
              No upcoming appointments
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Book a visit to explore your next property.
            </p>
            <div className="text-white"><Link
              to="/properties"
              className="mt-4 inline-block rounded-lg bg-[#171717] px-5 py-3 text-sm font-medium text-white"
            >
              Explore Properties
            </Link></div>
          </div>
        ) : (
          upcomingAppointments.map(renderAppointment)
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">
          Past & Cancelled Appointments
        </h2>

        {pastAppointments.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No past or cancelled appointments.
          </p>
        ) : (
          pastAppointments.map(renderAppointment)
        )}
      </section>
    </div>
  );
};

export default MyAppointments;
