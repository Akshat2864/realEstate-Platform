
import { useState, type FormEvent } from "react";
import { UserRound, Mail, CalendarDays, Save } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/auth.service";

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters");
      return;
    }

    try {
      setLoading(true);

      await updateProfile(name.trim());
      await refreshUser();

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage your personal account information.
        </p>
      </div>

      {/* Profile header */}
      <div className="rounded-2xl bg-[#171717] p-7 text-white">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#B9E4C8] text-neutral-900">
            <UserRound size={38} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-neutral-300">
              DreamDwell Member
            </p>
          </div>
        </div>
      </div>

      {/* Profile information */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-neutral-900">
          Personal Information
        </h2>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Full Name
          </label>

          <div className="relative">
            <UserRound
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#79BD98]"
              required
              minLength={2}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-4 text-sm text-neutral-500"
            />
          </div>

          <p className="mt-2 text-xs text-neutral-400">
            Email address cannot be changed here.
          </p>
        </div>

        {user.createdAt && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Member Since
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              <CalendarDays size={18} />
              {new Date(user.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-neutral-100 pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            <Save size={17} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
