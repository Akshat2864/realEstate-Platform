
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await login({ email, password });

      toast.success("Welcome back to DreamDwell!");
      navigate("/dashboard", { replace: true });

    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-80px)] bg-white lg:grid-cols-2">

      {/* IMAGE SECTION */}
      <div className="relative hidden overflow-hidden bg-[#171717] lg:block">
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
          alt="DreamDwell luxury home"
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-16 left-12 right-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#B9E4C8]">
            Welcome to DreamDwell
          </p>

          <h1 className="mt-4 text-5xl font-semibold leading-tight">
            Every great journey begins with a place to call home.
          </h1>

          <p className="mt-5 max-w-md text-gray-200">
            Find spaces that inspire you and discover your next chapter.
          </p>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Sign in to continue your DreamDwell journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-[#79BD98]"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-[#79BD98]"
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

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#39865A] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171717] py-4 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
              {!submitting && <ArrowRight size={17} />}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#39865A] hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;
