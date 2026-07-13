import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function DriverMyRides() {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const navigate = useNavigate();
// --------------------------------------------------------------------------------
  // useEffect(() => {
  //   api.get("/rides/driver/my").then(res => {
  //     setRides(res.data);
  //   });
  // }, []);
  useEffect(() => {
  api.get("/rides/driver/my").then(res => {

    // console.log("DRIVER RIDES =", res.data);
    console.log(JSON.stringify(res.data, null, 2));

    setRides(res.data);
  });
}, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Created Rides</h1>
{/* ------------------------------------------------------------------------------- */}
     {rides.map((ride) => (
  <div
    key={ride._id}
    className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition"
  >
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

      {/* LEFT */}
      <div className="flex-1">
        <p className="font-semibold text-lg">
          {ride.origin} → {ride.destination}
        </p>

        <p className="text-sm text-gray-500">
          {new Date(ride.date).toLocaleString()}
        </p>

        <span
          className={`inline-block mt-1 px-3 py-1 text-xs rounded-full
          ${
            ride.status === "COMPLETED"
              ? "bg-green-100 text-green-600"
              : ride.status === "OPEN"
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {ride.status}
        </span>

        <p className="text-xs text-gray-500 mt-2">
          Seats Left: {ride.seatsAvailable}
        </p>
      </div>

      {/* MIDDLE */}
      <div className="flex-1 grid grid-cols-2 gap-6 text-sm">

        {/* DRIVER */}
        {/* <div>
          <p className="text-gray-400 text-xs">Driver</p>
          <p className="font-semibold">You</p>
        </div> */}

        {/* VEHICLE */}
        <div>
          <p className="text-gray-400 text-xs">Vehicle</p>
          <p className="font-semibold">
            {ride.vehicleType || "N/A"} - {ride.vehicleName || ""}
          </p>
          <p className="text-gray-500 text-xs">
            {ride.fuelType || ""} • {ride.vehicleNumber || "N/A"}
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-2">

        <button
          onClick={() => navigate(`/driver/ride/${ride._id}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
        >
          View Details →
        </button>
        {ride.status === "COMPLETED" && (
  <button
    onClick={() => setSelectedRide(ride)}
    className="
      px-4
      py-2
      bg-green-600
      text-white
      rounded-full
      text-sm
      hover:bg-green-700
    "
  >
    Reviews ({ride.reviews.length})
  </button>
)}

      </div>

    </div>
  </div>
))}
{/* ---------------------------------------------------- */}  
{selectedRide && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto relative">

      <button
        onClick={() => setSelectedRide(null)}
        className="absolute top-3 right-4 text-xl"
      >
        ✖
      </button>

      <h2 className="text-xl font-bold mb-4">
        Ride Reviews
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        {selectedRide.origin} → {selectedRide.destination}
      </p>

      {selectedRide.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        selectedRide.reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-xl p-4 mb-3"
          >
            <p className="font-semibold">
              ⭐ {review.rating}/5
            </p>

            <p className="text-gray-600 mt-2">
              {review.comment}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}

    </div>

  </div>
)}
    </div>
  );
}
