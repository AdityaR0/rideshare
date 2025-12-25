import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function MyRides() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/bookings/passenger/my")
      .then((res) => {
        setBookings(res.data || []);
      })
      .catch(() => {
        setBookings([]);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Rides</h1>

      {bookings.length === 0 ? (
        <p>No rides booked yet.</p>
      ) : (
        bookings
          .filter((b) => b && b.ride)   // 🚨 avoid null rides
          .map((b) => (
            <div key={b._id} className="border p-4 rounded-xl mb-3">
              <p className="font-semibold">
                {b?.ride?.origin} → {b?.ride?.destination}
              </p>

              <p>
                Date:
                {b?.ride?.date
                  ? new Date(b.ride.date).toLocaleString()
                  : "N/A"}
              </p>

              <p>Status: {b?.status || "N/A"}</p>

              <button
                onClick={() => navigate(`/passenger/ride/${b._id}`)}
                className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded"
              >
                View Details
              </button>
            </div>
          ))
      )}
    </div>
  );
}
