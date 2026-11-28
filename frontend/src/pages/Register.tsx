
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await register({ name, email, password });

      toast.success("Account created! Please sign in.");
      navigate("/login");

    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F7F7F5] px-5 py-14">

      <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-10">

        <div className="mb-9">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#72B990]">
            Join DreamDwell
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Start discovering properties and managing your listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#79BD98]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#79BD98]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none focus:border-[#79BD98]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm password
            </label>

            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none focus:border-[#79BD98]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] py-4 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
            {!submitting && <ArrowRight size={17} />}
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#39865A] hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
