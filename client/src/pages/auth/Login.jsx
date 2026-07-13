import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_PASSWORD, ADMIN_USER } from "../../config/adminConfig";

export default function Login() {
  const [role, setRole] = useState("passenger"); // passenger | driver | admin
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ================= ADMIN LOGIN (LOCAL ONLY) =================
    if (role === "admin") {
      if (form.password !== ADMIN_PASSWORD) {
        setError("Incorrect admin password.");
        return;
      }

      // Admin does NOT need backend fetch
      localStorage.setItem("carpool-token", "admin-token");
      localStorage.setItem("carpool-user", JSON.stringify(ADMIN_USER));

      navigate("/admin/dashboard");
      return;
    }

    // ================= PASSENGER / DRIVER LOGIN =================
    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        role,
      });

      const { token, user } = res.data;

      // 🔥 IMPORTANT: login with TOKEN ONLY
      await login({ token });

      // 🔁 use login response user ONLY for routing decision
      if (!user.isProfileComplete) {
        navigate("/complete-profile");
        return;
      }

      if (user.role === "passenger") {
        navigate("/passenger/dashboard");
      } else if (user.role === "driver") {
        navigate("/driver/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Color-fixed tab styles
  const tabClass = (tabRole) =>
    `flex-1 text-center py-2 text-sm font-semibold rounded-full transition ${
      role === tabRole
        ? "bg-white text-slate-900 shadow-sm"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-[calc(100vh-64px-64px)] flex items-center justify-center bg-[#F7F7F7] px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow">
            <span className="text-2xl">🚗</span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900">
            RideShare
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-slate-100 rounded-full p-1 mb-6 text-xs sm:text-sm">
          <button
            type="button"
            className={tabClass("passenger")}
            onClick={() => {
              setRole("passenger");
              setError("");
            }}
          >
            Passenger
          </button>
          <button
            type="button"
            className={tabClass("driver")}
            onClick={() => {
              setRole("driver");
              setError("");
            }}
          >
            Driver
          </button>
          {/* <button
            type="button"
            className={tabClass("admin")}
            onClick={() => {
              setRole("admin");
              setError("");
              setForm({ email: "", password: "" });
            }}
          >
            Admin
          </button> */}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role !== "admin" && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              {role === "admin" ? "Admin Password" : "Password"}
            </label>
            <input
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-slate-900 text-white rounded-full py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-xs sm:text-sm text-slate-500 text-center">
          Don’t have an account? Register as Passenger or Driver.
        </p>
      </div>
    </div>
  );
}
