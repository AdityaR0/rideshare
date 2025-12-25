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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ride Details</h1>

      <div className="bg-white rounded-xl border p-4 space-y-2">
        <p><b>Route:</b> {ride.origin} → {ride.destination}</p>
        <p><b>Date:</b> {new Date(ride.date).toLocaleString()}</p>
        <p><b>Status:</b> {ride.status}</p>
        <p><b>Seats Left:</b> {ride.seatsAvailable}</p>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Passengers</h2>

        {bookings.length === 0 ? (
          <p>No passengers yet</p>
        ) : (
          bookings.map(b => (
            <div key={b._id} className="border p-2 rounded mb-2">
              <p><b>Name:</b> {b.passenger.name}</p>
              <p><b>Phone:</b> {b.passenger.phone}</p>
              <p><b>Status:</b> {b.status}</p>
            </div>
          ))
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
