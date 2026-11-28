
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { CalendarDays, Clock3 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { bookAppointment } from "../../services/appointment.service";

interface Props {
  propertyId: string;
  ownerId: string;
}

const AppointmentBooking = ({ propertyId, ownerId }: Props) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isOwner = Boolean(
    user && (user._id || (user as typeof user & { id?: string }).id) === ownerId
  );

  // Use local calendar date for the date input
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to book an appointment");
      navigate("/login");
      return;
    }

    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

    // Interpret date and time in the visitor's local timezone.
    const start = new Date(`${date}T${time}:00`);

    if (Number.isNaN(start.getTime()) || start <= new Date()) {
      toast.error("Please select a future date and time");
      return;
    }

    try {
      setLoading(true);

      await bookAppointment({
        propertyId,
        startAt: start.toISOString(),
        message: message.trim(),
      });

      toast.success("Your 2-hour visit is confirmed!");
      navigate("/dashboard/appointments");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message;

        if (status === 409) {
          toast.error("This slot is already booked. Choose another time.");
        } else {
          toast.error(serverMessage || "Failed to book appointment");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h3 className="font-semibold text-neutral-900">Your Property</h3>
        <p className="mt-2 text-sm text-neutral-500">
          You cannot book a visit to your own property.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-xl font-bold text-neutral-900">
          Schedule a Visit
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Book a 2-hour property viewing.
        </p>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <CalendarDays size={17} />
          Preferred Date
        </label>
        <input
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-lg border border-neutral-200 px-4 py-3 outline-none focus:border-[#79BD98]"
        />
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Clock3 size={17} />
          Preferred Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full rounded-lg border border-neutral-200 px-4 py-3 outline-none focus:border-[#79BD98]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Message (Optional)
        </label>
        <textarea
          rows={3}
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I'd like to visit this property..."
          className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 outline-none focus:border-[#79BD98]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#171717] px-5 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
      >
        {loading
          ? "Confirming..."
          : isAuthenticated
            ? "Confirm Appointment"
            : "Sign In to Book"}
      </button>

      <p className="text-center text-xs text-neutral-500">
        Appointments are automatically confirmed if the time is available.
      </p>
    </form>
  );
};

export default AppointmentBooking;
