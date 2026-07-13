import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function DriverProfilePage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    workingAt: user?.workingAt || "",
    address: user?.address || "",
  });

  const updateProfile = async (e) => {
    e.preventDefault();
    await api.put("/users/me", profile);
    await refreshProfile();
    alert("Profile updated");
  };

  return (
    <div className="bg-slate-50 py-10">
      {/* <div className="max-w-lg mx-auto px-4"> */}
      <div className="max-w-2xl mx-auto px-4">
        <form
          onSubmit={updateProfile}
          // className="bg-white rounded-2xl shadow-sm p-6 space-y-5"
          className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6"
        >
          {/* <h2 className="text-xl font-semibold text-slate-900">
            Driver Profile
          </h2> */}
          <div>

  <button
    type="button"
    onClick={() => navigate(-1)}
    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
  >
    ← Back to Dashboard
  </button>

  <div className="text-center mt-4">

    <div className="w-24 h-24 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-5xl">
      👨‍✈️
    </div>

    <h2 className="text-3xl font-bold text-slate-900 mt-3">
      Driver Profile
    </h2>

    <p className="text-slate-500 text-sm">
      Manage your driver account information
    </p>

  </div>

</div>

<div className="flex justify-center gap-2 flex-wrap">

  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
    ✓ Driver Account
  </span>

  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
    🚗 Ride Provider
  </span>

  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
    ⭐ Trusted Driver
  </span>

</div>

          {/* FULL NAME (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Full Name
            </label>
            <input
              value={user?.name || ""}
              disabled
              // className="w-full rounded-lg border bg-slate-100 px-3 py-2 text-sm"
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          {/* WORKING AT */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Working at
            </label>
            <input
              value={profile.workingAt}
              onChange={(e) =>
                setProfile({ ...profile, workingAt: e.target.value })
              }
              // className="w-full rounded-lg border px-3 py-2 text-sm"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Address
            </label>
            <input
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              // className="w-full rounded-lg border px-3 py-2 text-sm"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
