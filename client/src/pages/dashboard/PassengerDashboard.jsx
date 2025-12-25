// client/src/pages/dashboard/PassengerDashboard.jsx
import { useAuth } from "../../context/AuthContext";
import DashboardCard from "../../components/DashboardCard";
import { Link } from "react-router-dom";

export default function PassengerDashboard() {
  const { user } = useAuth();

  const stats = {
    totalRidesTaken: user?.totalRidesTaken || 0,
    cancelledRides: user?.passengerCancelledRides || 0,
    upcomingRides: user?.upcomingRides || 0,
  };

  return (
    <div className="bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-500">
            Passenger Dashboard
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Welcome back, {user?.name?.split(" ")[0] || "Passenger"} 👋
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            From here you can search and book rides, send SOS during a trip,
            and review your rides after completion.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Total rides taken</p>
            <p className="text-2xl font-semibold text-indigo-600">
              {stats.totalRidesTaken}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Rides cancelled</p>
            <p className="text-2xl font-semibold text-rose-500">
              {stats.cancelledRides}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Upcoming rides</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {stats.upcomingRides}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <DashboardCard icon="🚐" title="Rides">
  <p>
    Search for rides based on route, date and time. Book seats and
    view your ride history.
  </p>

  <div className="flex gap-3 mt-3">
    {/* Search rides */}
    {/* <button
      onClick={() => navigate("/passenger/my-rides")}
      className="px-4 py-2 rounded-full text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Search rides
    </button> */}
    <Link
      to="/passenger/create-ride"
      className="px-4 py-2 rounded-full text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 inline-block"
    >
      Search rides
    </Link>

    {/* View ride details */}
    <Link
      to="/passenger/my-rides"
      className="px-4 py-2 rounded-full text-xs font-semibold border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
    >
      My Rides
    </Link>
  </div>
</DashboardCard>

            <DashboardCard icon="🚨" title="SOS Center">
              <p>
                During an active ride you will see an <b>SOS button</b>. Pressing
                it instantly alerts the admin with your current ride details.
              </p>
            </DashboardCard>

            <DashboardCard icon="⭐" title="Ride Reviews">
              <p>
                After each completed ride you can rate your driver and leave a
                short review to help other passengers.
              </p>
            </DashboardCard>
          </div>

          <div className="space-y-4">
            <DashboardCard icon="👤" title="Your Profile">
              <ul className="text-sm space-y-1">
                <li>
                  <span className="font-medium">Name:</span> {user?.name}
                </li>
                <li>
                  <span className="font-medium">Email:</span> {user?.email}
                </li>
                <li>
                  <span className="font-medium">Aadhaar:</span>{" "}
                  {user?.aadharNumber || "Not set"}
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

              <Link
                to="/passenger/profile"
                className="mt-3 inline-block text-xs text-indigo-600 font-semibold"
              >
                Edit profile
              </Link>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
