import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

export default function DriverRideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/rides/driver/${id}/details`)
      .then(res => setData(res.data))
      .catch(() => alert("Failed to load ride details"));
  }, [id]);

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
    <div className="grid md:grid-cols-2 gap-4">

      {/* LEFT → RIDE DETAILS */}
      <div className="bg-white rounded-xl border p-4 space-y-2">
        <p><b>Route:</b> {ride.origin} → {ride.destination}</p>
        <p><b>Date:</b> {new Date(ride.date).toLocaleString()}</p>

        <p>
          <b>Status:</b>{" "}
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            {ride.status}
          </span>
        </p>

        <p><b>Seats Left:</b> {ride.seatsAvailable}</p>
      </div>

      {/* RIGHT → VEHICLE DETAILS */}
      <div className="bg-white rounded-xl border p-4 space-y-2">
        <p><b>Vehicle Type:</b> {ride.vehicleType || "N/A"}</p>
        <p><b>Vehicle Name:</b> {ride.vehicleName || "N/A"}</p>
        <p><b>Number:</b> {ride.vehicleNumber || "N/A"}</p>
        <p><b>Fuel:</b> {ride.fuelType || "N/A"}</p>
      </div>

    </div>

    {/* 🔥 ACTION BUTTONS */}
    <div className="flex gap-3">

      {ride.status === "OPEN" && activePassengers.length > 0 && (
        <button
          onClick={startRide}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Start Ride
        </button>
      )}

      {ride.status === "ONGOING" && activePassengers.length > 0 && (
        <button
          onClick={endRide}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          End Ride
        </button>
      )}

      {/* 🔴 DEMO CANCEL BUTTON */}
      <button
        onClick={() => alert("Cancel Ride clicked (demo)")}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Cancel Ride ✖
      </button>

    </div>

    {/* 🔥 PASSENGERS TABLE */}
    <div className="bg-white rounded-xl border p-4">
      <h2 className="font-semibold mb-2">Passengers</h2>

      {bookings.length === 0 ? (
        <p>No passengers yet</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="p-2 border">{b.passenger.name}</td>
                <td className="p-2 border">{b.passenger.phone}</td>
                <td className="p-2 border">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

    <button
      className="px-4 py-2 bg-gray-200 rounded"
      onClick={() => navigate(-1)}
    >
      Back
    </button>

  </div>
);
}
