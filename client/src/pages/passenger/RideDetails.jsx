import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
import { useEffect, useState, useRef } from "react";
import api from "../../utils/axios";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

export default function RideDetails() {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [ride, setRide] = useState(null);

  const mapContainerRef = useRef(null);
const mapRef = useRef(null);
const routingRef = useRef(null);

  const shareRide = () => {

  if (!booking) return;

//   const message = `🚗 RideShare Trip Update

// Route: ${booking.ride.origin} → ${booking.ride.destination}
// Date: ${new Date(booking.ride.date).toLocaleString()}
// Driver: ${booking.ride.driver.name}

// Track my ride here:
// ${window.location.href}
// `;
const message = `🚗 RideShare Trip Update

Route: ${ride.origin} → ${ride.destination}
Date: ${new Date(ride.date).toLocaleString()}

Driver: ${ride.driver?.name || "N/A"}
Phone: ${ride.driver?.phone || "N/A"}

Vehicle: ${ride.vehicleType || "N/A"} - ${ride.vehicleName || "N/A"}
Vehicle Number: ${ride.vehicleNumber || "N/A"}
Fuel: ${ride.fuelType || "N/A"}

Track my ride here:
${window.location.href}
`;

  const whatsappURL =
    "https://wa.me/?text=" + encodeURIComponent(message);

  window.open(whatsappURL, "_blank");
};

  // useEffect(() => {
  //   api.get(`/bookings/${id}`).then(res => setBooking(res.data));
  // }, [id]);
  useEffect(() => {
  const fetchDetails = async () => {
    try {
      // 1️⃣ get booking
      const bookingRes = await api.get(`/bookings/${id}`);
      setBooking(bookingRes.data);

      // 2️⃣ get rideId from booking
      const rideId = bookingRes.data?.ride?._id;

      // 3️⃣ fetch ride details
      if (rideId) {
        const rideRes = await api.get(`/rides/${rideId}`);
        setRide(rideRes.data.ride);
      }

    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  fetchDetails();
}, [id]);

useEffect(() => {

  if (!ride) return;
  if (!mapContainerRef.current) return;

  if (!mapRef.current) {

    mapRef.current = L.map(mapContainerRef.current).setView(
      [22.5726, 88.3639],
      11
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap"
      }
    ).addTo(mapRef.current);
  }

  const drawRoute = async () => {

    const getCoords = async (place) => {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
      );

      const data = await res.json();

      if (!data[0]) return null;

      return [
        parseFloat(data[0].lat),
        parseFloat(data[0].lon)
      ];
    };

    const from = await getCoords(ride.origin);
    const to = await getCoords(ride.destination);

    if (!from || !to) return;

    if (routingRef.current) {
      mapRef.current.removeControl(routingRef.current);
    }

    routingRef.current = L.Routing.control({
      waypoints: [
        L.latLng(from[0], from[1]),
        L.latLng(to[0], to[1]),
      ],
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      show: false,
    }).addTo(mapRef.current);

    mapRef.current.fitBounds([
      L.latLng(from[0], from[1]),
      L.latLng(to[0], to[1]),
    ]);
  };

  drawRoute();

}, [ride]);

  
const handleCancel = async () => {
  try {
    const reason = prompt(
      "Why are you cancelling?\n\n1. Change of plans\n2. Driver taking too long\n3. Booked by mistake\n4. Other"
    );

    if (!reason) return;

    await api.put(`/bookings/${booking._id}/cancel`, {
      reason,
    });

    alert("Ride cancelled");

    navigate("/passenger/my-rides");

  } catch (err) {
    console.error(err);
    alert("Failed to cancel ride");
  }
};

if (!booking || !ride)
  return <p className="p-6">Loading...</p>;
// if (!booking || !ride)
//   return <p className="p-6">Loading...</p>;

console.log("RIDE DATA:", ride);
// -------------------------------------------------

 return (
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6">
      Ride Details
    </h1>

    {/* <div className="grid md:grid-cols-3 gap-6"> */}
    <div className="grid lg:grid-cols-2 gap-6">

      {/* LEFT CARD */}
      {/* MAP CARD */}
{/* <div className="bg-white rounded-2xl shadow-lg overflow-hidden"> */}
<div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">

  <div className="p-4 border-b">
    

    <button
      onClick={() => navigate(-1)}
      className="text-sm text-indigo-600 hover:text-indigo-800"
    >
      ← Back
    </button>

  </div>

  <div
    ref={mapContainerRef}
  className="h-[500px] w-full"
  >
  </div>

</div>

      {/* RIGHT SIDE */}
      {/* <div className="md:col-span-2 space-y-5"> */}
      <div className="space-y-5">

        {/* TRIP INFORMATION */}
<div className="bg-white rounded-2xl shadow-lg p-5">

  <h3 className="font-semibold text-lg mb-4">
    Trip Information
  </h3>

  <div className="space-y-3 text-sm">

    <div>
      <p className="text-slate-500 text-xs">
        Status
      </p>

      <span
        className={`px-3 py-1 text-xs rounded-full
        ${
          ride.status === "OPEN"
            ? "bg-green-100 text-green-700"
            : ride.status === "ONGOING"
            ? "bg-yellow-100 text-yellow-700"
            : ride.status === "COMPLETED"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {ride.status}
      </span>
    </div>

    <div>
      <p className="text-slate-500 text-xs">
        Date & Time
      </p>

      <p>
        {new Date(ride.date).toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-slate-500 text-xs">
        Pickup
      </p>

      <p>{ride.origin}</p>
    </div>

    <div>
      <p className="text-slate-500 text-xs">
        Destination
      </p>

      <p>{ride.destination}</p>
    </div>

  </div>
{booking.status === "confirmed" &&
 ride.status !== "COMPLETED" && (

<div className="flex gap-3 mt-6">

  <button
    onClick={shareRide}
    className="
      flex-1
      py-3
      rounded-xl
      bg-green-100
      text-green-700
      hover:bg-green-200
      font-medium
    "
  >
    Share Ride
  </button>

  <button
    onClick={handleCancel}
    className="
      flex-1
      py-3
      rounded-xl
      bg-red-100
      text-red-600
      hover:bg-red-200
      font-medium
    "
  >
    Cancel Ride
  </button>

</div>

)}

</div>


        {/* DRIVER CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shadow-inner text-xl">
            {ride.driver?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <p className="text-xs text-gray-500">Driver</p>
            <p className="text-lg font-semibold">
              {ride.driver?.name || "N/A"}
            </p>

            <p className="text-sm text-gray-500">
              📞 {ride.driver?.phone || "N/A"}
            </p>

          </div>

        </div>

        {/* VEHICLE CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4">

          <div className="w-24 h-16 bg-gray-200 rounded-xl flex items-center justify-center shadow-inner">
            {ride.vehicleType === "bike"
  ? "🏍️"
  : ride.vehicleType === "car"
  ? "🚘"
  : "🚗"}
          </div>

          <div>
            <p className="text-xs text-gray-500">Vehicle</p>

            <p className="text-lg font-semibold">
              {ride.vehicleName || "N/A"} ({ride.vehicleType || "N/A"})
            </p>

            <p className="text-sm text-gray-500">
              Fuel: {ride.fuelType || "N/A"}
            </p>

            <p className="text-sm text-gray-500">
              Number: {ride.vehicleNumber || "N/A"}
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>
);
}
