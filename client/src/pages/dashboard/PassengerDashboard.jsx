import { useAuth } from "../../context/AuthContext";
import DashboardCard from "../../components/DashboardCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function PassengerDashboard() {
  const { user } = useAuth();

  // const stats = {
  //   totalRidesTaken: user?.totalRidesTaken || 0,
  //   cancelledRides: user?.passengerCancelledRides || 0,
  //   upcomingRides: user?.upcomingRides || 0,
  // };
  const [stats, setStats] = useState({
  total: 0,
  cancelled: 0,
  upcoming: 0,
});

useEffect(() => {
  api.get("/bookings/passenger/stats")
    .then((res) => {
      setStats(res.data);
    })
    .catch((err) => {
      console.error("Error fetching stats:", err);
    });
}, []);

  return (
    <div className="bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* 🔥 HEADER (PREMIUM) */}
        {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow"> */}
        <div className="bg-white text-black p-6 rounded-2xl shadow border border-slate-200">
          <p className="text-xs uppercase tracking-widest opacity-80">
            Passenger Dashboard
          </p>

          <h1 className="text-3xl font-bold mt-1">
            Welcome back, {user?.name?.split(" ")[0] || "Passenger"} 👋
          </h1>

          <p className="text-sm opacity-90 mt-1 max-w-xl">
            Search rides, track trips, send SOS alerts, and manage your journey easily.
          </p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs text-slate-500">Total rides</p>
            <h2 className="text-3xl font-bold text-indigo-600">
              {/* {stats.totalRidesTaken} */}
              {stats.total}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs text-slate-500">Cancelled</p>
            <h2 className="text-3xl font-bold text-rose-500">
              {/* {stats.cancelledRides} */}
              {stats.cancelled}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg hover:scale-[1.02] transition">
            <p className="text-xs text-slate-500">Upcoming</p>
            <h2 className="text-3xl font-bold text-emerald-600">
              {/* {stats.upcomingRides} */}
              {stats.upcoming}
            </h2>
          </div>
        </div>

        {/* 🔥 MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-4">

            {/* RIDES */}
            <DashboardCard icon="🚐" title="Rides">
              <p>
                Search for rides based on route, date and time. Book seats and
                view your ride history.
              </p>

              <div className="flex gap-3 mt-4">
                {/* <Link
                  to="/passenger/create-ride"
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Search rides
                </Link> */}
                <Link
  to="/passenger/my-rentals"
  className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
>
  My Rentals
</Link>

                <Link
                  to="/passenger/my-rides"
                  className="px-4 py-2 rounded-full text-sm font-semibold border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                >
                  My Rides
                </Link>
              </div>
            </DashboardCard>

            {/* SOS */}
            <DashboardCard icon="🚨" title="SOS Center">
              <p className="mb-3">
                During an active ride you will see an <b>SOS button</b>. Pressing
                it instantly alerts the admin with your current ride details.
              </p>

              <button className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition">
                SOS (Active Ride Only)
              </button>
            </DashboardCard>

            {/* REVIEWS */}
            <DashboardCard icon="⭐" title="Ride Reviews">
              <p>
                After each completed ride you can rate your driver and leave a
                short review to help other passengers.
              </p>
            </DashboardCard>

          </div>

          {/* RIGHT SECTION (PROFILE) */}
          <div className="space-y-4">

            <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition border border-slate-100">

              {/* PROFILE HEADER */}
              <div className="flex flex-col items-center text-center mb-4">
                {/* <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
                  👤
                </div> */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl text-white shadow-lg">
  👤
</div>

                {/* <h3 className="font-semibold mt-2">{user?.name}</h3> */}
                <h3 className="text-lg font-bold text-slate-900 mt-3">
  {user?.name}
</h3>
<div className="flex justify-center my-4">
  <div className="h-[2px] w-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
</div>
                {/* <p className="text-xs text-slate-500">{user?.email}</p> */}
              </div>

              {/* PROFILE DETAILS */}
              <ul className="text-sm space-y-2">
                <li>
  <span className="font-medium">
    Email:
  </span>{" "}
  {user?.email}
</li>
                {/* <li>
                  <span className="font-medium">Aadhaar:</span>{" "}
                  {user?.aadharNumber || "Not set"}
                </li> */}
                <li>
  <span className="font-medium">Aadhaar:</span>{" "}
  {user?.aadharNumber
    ? `XXXX XXXX ${user.aadharNumber.slice(-4)}`
    : "Not set"}
</li>

                <li>
                  <span className="font-medium">Working at:</span>{" "}
                  {user?.workingAt || "Not set"}
                </li>

                <li>
                  <span className="font-medium">Address:</span>{" "}
                  {user?.address || "Not set"}
                </li>
              </ul>

              {/* <Link
                to="/passenger/profile"
                className="mt-4 block text-center bg-indigo-600 text-white py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Edit Profile
              </Link> */}
              <Link
  to="/passenger/profile"
  className="mt-3 inline-block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
>
  Edit Profile
</Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}