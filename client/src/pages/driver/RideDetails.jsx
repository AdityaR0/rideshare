// import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { useEffect, useState, useRef } from "react";

import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

export default function DriverRideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

const mapContainerRef = useRef(null);
const mapRef = useRef(null);
const routingRef = useRef(null);

  useEffect(() => {
    api.get(`/rides/driver/${id}/details`)
      .then(res => setData(res.data))
      .catch(() => alert("Failed to load ride details"));
  }, [id]);

  useEffect(() => {

  if (!data) return;
  if (!mapContainerRef.current) return;

  if (!mapRef.current) {

    mapRef.current = L.map(
      mapContainerRef.current
    ).setView(
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

      const result = await res.json();

      if (!result[0]) return null;

      return [
        parseFloat(result[0].lat),
        parseFloat(result[0].lon)
      ];
    };

    const from = await getCoords(data.ride.origin);
    const to = await getCoords(data.ride.destination);

    if (!from || !to) return;

    if (routingRef.current) {
      mapRef.current.removeControl(
        routingRef.current
      );
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

}, [data]);

  if (!data) return <p className="p-6">Loading...</p>;

  const { ride, bookings } = data;
  const activePassengers = bookings.filter(b => b.status === "confirmed");

  const startRide = async () => {
  try {

    await api.patch(`/rides/${ride._id}/start`);

    alert("Ride started");

    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Failed to start ride");
  }
};

const endRide = async () => {
  try {

    await api.patch(`/rides/${ride._id}/complete`);

    alert("Ride completed");

    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Failed to end ride");
  }
};


// ------------------------------------------------------------------------------------------
  return (
  <div className="max-w-5xl mx-auto p-6 space-y-6">

    <h1 className="text-2xl font-bold">Ride Details</h1>

    {/* 🔥 TOP SECTION (2 COLUMN) */}
    {/* <div className="grid md:grid-cols-2 gap-4"> */}
    <div className="grid lg:grid-cols-2 gap-6">

      {/* LEFT → RIDE DETAILS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

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
  className="h-[380px] w-full"
/>

</div>

      {/* RIGHT → VEHICLE DETAILS */}
      <div className="bg-white rounded-2xl shadow-lg p-5">

  <h3 className="font-semibold text-lg mb-4">
    Trip Information
  </h3>

  <div className="space-y-3 text-sm">

    <div>
      <p className="text-slate-500 text-xs">
        Status
      </p>

      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
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

    <div>
      <p className="text-slate-500 text-xs">
        Seats Available
      </p>

      <p>{ride.seatsAvailable}</p>
    </div>

    <div>
      <p className="text-slate-500 text-xs">
        Vehicle
      </p>

      <p>
        {ride.vehicleName} ({ride.vehicleType})
      </p>

      <p className="text-xs text-slate-500">
        {ride.vehicleNumber}
      </p>
    </div>

  </div>

  <div className="flex gap-3 mt-6">

  {ride.status === "OPEN" &&
    activePassengers.length > 0 && (

    <button
      onClick={startRide}
      className="
      flex-1
      py-3
      rounded-xl
      bg-green-100
      text-green-700
      hover:bg-green-200
      "
    >
      Start Ride
    </button>
  )}

  {ride.status === "ONGOING" &&
    activePassengers.length > 0 && (

    <button
      onClick={endRide}
      className="
      flex-1
      py-3
      rounded-xl
      bg-blue-100
      text-blue-700
      hover:bg-blue-200
      "
    >
      Complete Ride
    </button>
  )}

  {ride.status !== "COMPLETED" && (
    <button
      className="
      flex-1
      py-3
      rounded-xl
      bg-red-100
      text-red-600
      hover:bg-red-200
      "
    >
      Cancel Ride
    </button>
  )}

</div>

</div>

    </div>

    {/* 🔥 ACTION BUTTONS */}
   

    {/* 🔥 PASSENGERS TABLE */}
    <div className="bg-white rounded-xl border p-4">
      <h2 className="font-semibold text-lg mb-4">
  Passengers ({activePassengers.length})
</h2>
<p className="text-sm text-slate-500 mt-1">
  Confirmed passengers for this ride
</p>

      {bookings.length === 0 ? (
  <p className="text-slate-500">
    No passengers yet
  </p>
) : (

  <div className="space-y-3">

    {bookings.map((b) => (

      <div
        key={b._id}
        className="
          border
          rounded-xl
          p-4
          flex
          items-center
          justify-between
          hover:shadow-md
          transition
        "
      >

        <div>

          <p className="font-semibold">
            👤 {b.passenger.name}
          </p>

          <p className="text-sm text-slate-500">
            📞 {b.passenger.phone}
          </p>

        </div>

        <span
          className="
            px-3
            py-1
            rounded-full
            text-xs
            bg-green-100
            text-green-700
          "
        >
          {b.status}
        </span>

      </div>

    ))}

  </div>

)}
    </div>

  </div>
);
}
