// src/pages/auth/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        { password }
      );

      // same storage logic as your current setup
      localStorage.setItem("carpool-token", res.data.token);
      localStorage.setItem(
        "carpool-user",
        JSON.stringify({
          role: "admin",
          name: "Admin",
        })
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Admin login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-64px)] flex items-center justify-center bg-[#F7F7F7] px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10">
        
        {/* Logo & Heading (same as Login.jsx) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow">
            <span className="text-2xl">🚗</span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900">
            RideShare
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Admin access only
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-slate-900 text-white rounded-full py-2.5 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <p className="mt-4 text-xs sm:text-sm text-slate-500 text-center">
          Restricted area – authorized users only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
