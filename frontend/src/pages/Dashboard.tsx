
import { Link } from "react-router";
import {
  House,
  PlusCircle,
  ArrowRight,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm text-gray-500">Welcome back,</p>
        <h2 className="mt-1 text-3xl font-semibold">
          {user?.name} 👋
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Here's your DreamDwell workspace.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        <Link
          to="/dashboard/listings"
          className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F5ED] text-[#39865A]">
            <House size={23} />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            My Listings
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            View and manage all your properties.
          </p>

          <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#39865A]">
            Manage listings <ArrowRight size={17} />
          </span>
        </Link>

        <Link
          to="/dashboard/create"
          className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F5ED] text-[#39865A]">
            <PlusCircle size={23} />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            Add New Property
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Publish a new property listing.
          </p>

          <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#39865A]">
            Create listing <ArrowRight size={17} />
          </span>
        </Link>

        <Link
          to="/dashboard/profile"
          className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg sm:col-span-2"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9F5ED] text-[#39865A]">
            <UserRound size={23} />
          </div>

          <h3 className="mt-5 text-lg font-semibold">
            My Profile
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            View your account information.
          </p>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;
