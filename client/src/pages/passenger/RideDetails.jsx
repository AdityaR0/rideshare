import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function RideDetails() {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(res => setBooking(res.data));
  }, [id]);

  if (!booking) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Ride Details</h2>

      <p><b>Route:</b> {booking.ride.origin} → {booking.ride.destination}</p>
      <p><b>Date:</b> {new Date(booking.ride.date).toLocaleString()}</p>
      <p><b>Driver:</b> {booking.ride.driver.name}</p>
      <p><b>Status:</b> {booking.status}</p>

      {booking.status === "confirmed" && (
        <button
          onClick={async () => {
            await api.put(`/bookings/${booking._id}/cancel`);
            alert("Ride cancelled");
            navigate("/passenger/my-rides");
          }}
          className="px-4 py-2 bg-rose-600 text-white rounded"
        >
          Cancel Ride
        </button>
      )}
    </div>
  );
}
