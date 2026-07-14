import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [role, setRole] = useState("passenger");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
      {
        ...form,
        role,
      }
    );

    alert("Account created successfully");
    navigate("/login");
  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Registration failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    // <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 flex items-center justify-center px-4 py-16">
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-10 relative">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚗</span>
            <span className="font-semibold text-lg text-slate-900">
              RideShare
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Join RideShare and start your journey
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-slate-100 rounded-full p-1 mb-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setRole("passenger")}
            className={`flex-1 py-2 rounded-full transition ${
              role === "passenger"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            Passenger
          </button>
          <button
            type="button"
            onClick={() => setRole("driver")}
            className={`flex-1 py-2 rounded-full transition ${
              role === "driver"
                ? "bg-white shadow text-slate-900"
                : "text-slate-500"
            }`}
          >
            Driver
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="text"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
