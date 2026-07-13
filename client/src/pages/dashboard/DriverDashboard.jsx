import { useAuth } from "../../context/AuthContext";
import DashboardCard from "../../components/DashboardCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function DriverDashboard() {
  const { user } = useAuth();

const [stats, setStats] = useState({
  total: 0,
  cancelled: 0,
  active: 0,
});

useEffect(() => {
  api.get("/rides/driver/stats")
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
        
        {/* HEADER */}
        {/* <div>
          <p className="text-xs uppercase tracking-widest text-emerald-500">
            Driver Dashboard
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {user?.name} 🚗
          </h1>
        </div> */}
        {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow"> */}
        <div className="bg-white text-black p-6 rounded-2xl shadow border border-slate-200">

  <p className="text-xs uppercase tracking-widest opacity-80">
    Driver Dashboard
  </p>

  <h1 className="text-3xl font-bold mt-1">
    Welcome back, {user?.name?.split(" ")[0] || "Driver"} 👋
  </h1>

  <p className="text-sm opacity-90 mt-1 max-w-xl">
    Manage your rides, track passengers, send SOS alerts, and handle your driving activity easily.
  </p>

</div>

        {/* STATS */}
        {/* <div className="grid sm:grid-cols-3 gap-4">
          <Stat title="Total rides given" value={user?.totalRidesGiven || 0} color="text-emerald-600" />
          <Stat title="Rides cancelled" value={user?.driverCancelledRides || 0} color="text-rose-500" />
          <Stat title="Active rides" value={user?.activeRides || 0} color="text-indigo-600" />
        </div> */}
        <div className="grid sm:grid-cols-3 gap-4">

  <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs text-slate-500">Total rides</p>
    <h2 className="text-3xl font-bold text-indigo-600">
      {/* {user?.totalRidesGiven || 0} */}
      {stats.total}
    </h2>
  </div>

  <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs text-slate-500">Cancelled</p>
    <h2 className="text-3xl font-bold text-rose-500">
      {/* {user?.driverCancelledRides || 0} */}
      {stats.cancelled}
    </h2>
  </div>

  <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg hover:scale-[1.02] transition">
    <p className="text-xs text-slate-500">Active</p>
    <h2 className="text-3xl font-bold text-emerald-600">
      {/* {user?.activeRides || 0} */}
      {stats.active}
    </h2>
  </div>

</div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          <DashboardCard icon="➕" title="Create Ride">
  <p className="text-sm text-slate-600 mb-3">
    {/* Offer a new carpool ride to passengers on your route. */}
     View all rental bookings made for your vehicles.
  </p>

  <div className="flex gap-3">
    {/* Create ride */}
    {/* <Link
      to="/driver/create-ride"
      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold"
    >
      Create Ride
    </Link> */}
    <Link
  to="/driver/rental-bookings"
  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold"
>
  Rental Bookings
</Link>

    {/* View created rides */}
    <Link
      to="/driver/my-rides"
      className="inline-block border border-indigo-600 text-indigo-600 px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-50"
    >
      My Rides
    </Link>
  </div>
</DashboardCard>

          <DashboardCard icon="🚨" title="SOS / Emergency">
            <p className="text-sm text-slate-600">
              If you face any emergency during a ride, instantly alert admin and share your live location.
            </p>
            <button
              className="mt-3 bg-rose-600 text-white px-4 py-2 rounded text-sm font-semibold"
              disabled
            >
              SOS (Demo)
            </button>
          </DashboardCard>
        </div>

        {/* DRIVER INFO */}
        {/* <DashboardCard icon="👤" title="Driver Information">
          <ul className="text-sm space-y-1">
            <li><b>Name:</b> {user?.name}</li>
            <li><b>Email:</b> {user?.email || "Not set"}</li>
            <li><b>License:</b> {user?.drivingLicense || "Not set"}</li>
            <li><b>Aadhaar:</b> {user?.aadharNumber || "Not set"}</li>
            <li><b>Working at:</b> {user?.workingAt || "Not set"}</li>
            <li><b>Address:</b> {user?.address || "Not set"}</li>
          </ul>

          <Link
            to="/driver/profile"
            className="text-indigo-600 text-sm font-semibold mt-2 inline-block"
          >
            Edit driver details
          </Link>
        </DashboardCard> */}
        <DashboardCard icon="👤" title="Driver Information">
  <div className="grid md:grid-cols-2 gap-6 items-center">

    {/* LEFT SIDE — DETAILS */}
    <div className="text-sm space-y-1">
      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email || "Not set"}</p>
      <p><b>License:</b> {user?.drivingLicense || "Not set"}</p>
      {/* <p><b>Aadhaar:</b> {user?.aadharNumber || "Not set"}</p> */}
      <p>
  <b>Aadhaar:</b>{" "}
  {user?.aadharNumber
    ? `XXXX XXXX ${user.aadharNumber.slice(-4)}`
    : "Not set"}
</p>
      <p><b>Working at:</b> {user?.workingAt || "Not set"}</p>
      <p><b>Address:</b> {user?.address || "Not set"}</p>

      <Link
        to="/driver/profile"
        className="text-indigo-600 text-sm font-semibold inline-block mt-2"
      >
        Edit driver details
      </Link>
    </div>

    {/* RIGHT SIDE — IMAGE */}
    {/* <div className="flex justify-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="Driver"
        className="w-32 h-32 object-cover rounded-full border shadow"
      />
    </div> */}
    {/* RIGHT SIDE — IMAGE */}
<div className="flex flex-col items-center gap-3">

  <img
    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    alt="Driver"
    className="w-32 h-32 object-cover rounded-full border shadow"
  />

  {/* DEMO UPLOAD BUTTON */}
  <button
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm font-medium"
    onClick={() => alert("Image upload feature coming soon 🚀")}
  >
    Upload Photo
  </button>

  {/* SMALL TEXT */}
  <p className="text-xs text-gray-400">
    Click to upload profile image
  </p>

</div>

  </div>
</DashboardCard>

{/* ---------------------------------------- */}
{/* <DashboardCard icon="👤" title="Driver Information">
  <div className="grid md:grid-cols-2 gap-6 items-center">

    <div className="flex flex-col items-center gap-3">

      <img
        src={
          user?.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        alt="Driver"
        className="w-32 h-32 object-cover rounded-full border shadow"
      />

      <label className="bg-indigo-600 text-white px-4 py-1 rounded cursor-pointer text-sm">
        Upload Photo
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];

            const reader = new FileReader();

            reader.onloadend = async () => {
              await api.put("/users/me", {
                profileImage: reader.result,
              });

              window.location.reload();
            };

            if (file) reader.readAsDataURL(file);
          }}
        />
      </label>

    </div>

    
    <div className="text-sm space-y-1">
      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email || "Not set"}</p>
      <p><b>License:</b> {user?.drivingLicense || "Not set"}</p>
      <p><b>Aadhaar:</b> {user?.aadharNumber || "Not set"}</p>
      <p><b>Working at:</b> {user?.workingAt || "Not set"}</p>
      <p><b>Address:</b> {user?.address || "Not set"}</p>
    </div>

  </div>
</DashboardCard> */}
{/* ---------------------------------------- */}

        {/* VEHICLES */}
        {/* <DashboardCard icon="🚙" title="Your Vehicles">
          {user?.vehicles?.length ? (
            user.vehicles.map((v, i) => (
              <div key={i} className="text-sm mb-3">
                <p><b>Type:</b> {v.vehicleType}</p>
                <p><b>Name:</b> {v.vehicleName}</p>
                <p><b>Number:</b> {v.vehicleNumber}</p>
                <hr className="my-2" />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No vehicles added</p>
          )}

          <Link
            to="/driver/vehicle"
            className="text-indigo-600 text-sm font-semibold"
          >
            Add / Manage vehicles
          </Link>
        </DashboardCard> */}

        <DashboardCard icon="🚙" title="Your Vehicles">
  {user?.vehicles?.length ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {user.vehicles.map((v, i) => (
        <div
          key={i}
          className="border rounded-xl p-3 text-sm bg-slate-50 shadow-sm"
        >
          <p><b>Type:</b> {v.vehicleType}</p>
          <p><b>Name:</b> {v.vehicleName}</p>
          <p><b>Number:</b> {v.vehicleNumber}</p>
          <p>⛽ <b>Fuel:</b> {v.fuelType || "petrol"}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-slate-500">No vehicles added</p>
  )}

  <Link
    to="/driver/vehicle"
    className="text-indigo-600 text-sm font-semibold mt-3 inline-block"
  >
    Add / Manage vehicles
  </Link>
</DashboardCard>

        {/* REVIEWS */}
        <DashboardCard icon="⭐" title="Ride Reviews">
          <p className="text-sm text-slate-600">
            Passenger ratings and reviews will appear here after completed rides.
          </p>
        </DashboardCard>

      </div>
    </div>
  );
}

const Stat = ({ title, value, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm">
    <p className="text-xs text-slate-500">{title}</p>
    <p className={`text-2xl font-semibold ${color}`}>{value}</p>
  </div>
);
