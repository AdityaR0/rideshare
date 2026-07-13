import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function MyRides() {
  // const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  // const userId = localStorage.getItem("userId");
  const { user } = useAuth();
const userId = user?._id;
  console.log("USER ID =", userId);
  const [bookings, setBookings] = useState([]);
  const [reviewRide, setReviewRide] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  

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


const submitReview = async () => {
  try {

    await api.post(`/rides/${reviewRide.ride._id}/review`, {
      rating,
      comment
    });

   alert("Review submitted successfully ⭐");

// mark this ride as reviewed in UI immediately
setBookings((prev) =>
  prev.map((b) =>
    b._id === reviewRide._id
      ? {
          ...b,
          ride: {
            ...b.ride,
            reviews: [
              ...(b.ride.reviews || []),
              {
                // passenger: localStorage.getItem("userId"),
                passenger: userId,
                rating,
                comment
              }
            ]
          }
        }
      : b
  )
);

setAlreadyReviewed(true);
setReviewRide(null);

  } catch (err) {

    console.error(err);
    alert("Failed to submit review");

  }
};


  return (
    <>
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Rides</h1>

      {bookings.length === 0 ? (
        <p>No rides booked yet.</p>
      ) : (

        // /---------------------------------------------------------

        bookings
          // .filter((b) => b && b.ride)  
          // .map((b) => (
            .map((b) => (
// /--------------------------------------------------------
            <div
  key={b._id}
  className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition"
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

    {/* LEFT */}
    <div className="flex-1">
      <p className="font-semibold text-lg">
        {b?.ride?.origin} → {b?.ride?.destination}
      </p>

      <p className="text-sm text-gray-500">
        {b?.ride?.date
          ? new Date(b.ride.date).toLocaleString()
          : "N/A"}
      </p>

      <span
        className={`inline-block mt-1 px-3 py-1 text-xs rounded-full
        ${
          b?.ride?.status === "COMPLETED"
            ? "bg-green-100 text-green-600"
            : b?.ride?.status === "OPEN"
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {b?.ride?.status}
      </span>

      <p className="text-xs text-gray-500 mt-2">
        Distance: ~10km • Est: ~20min
      </p>
    </div>

    {/* MIDDLE (SIDE BY SIDE FIXED) */}
    <div className="flex-1 grid grid-cols-2 gap-6 text-sm">

      {/* DRIVER */}
      <div>
        <p className="text-gray-400 text-xs">Driver</p>
        <p className="font-semibold">
          {b?.ride?.driver?.name || "N/A"}
        </p>
        <p className="text-gray-500 text-xs">
          {b?.ride?.driver?.phone || ""}
        </p>
      </div>

      {/* VEHICLE */}
      <div>
        <p className="text-gray-400 text-xs">Vehicle</p>
        <p className="font-semibold">
          {b?.ride?.vehicleType || "N/A"} - {b?.ride?.vehicleName || ""}
        </p>
        <p className="text-gray-500 text-xs">
          {b?.ride?.fuelType || ""} • {b?.ride?.vehicleNumber || "N/A"}
        </p>
      </div>

    </div>

    {/* RIGHT */}
    <div className="flex flex-col items-end gap-2">

      {/* VIEW BUTTON */}
      <button
        onClick={() => navigate(`/passenger/ride/${b._id}`)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700"
      >
        View Details →
      </button>

      {/* REVIEW LOGIC (UNCHANGED BUT STYLED) */}
      {b?.ride?.status === "COMPLETED" && (
        (b?.ride?.reviews || []).some(
          (r) =>
            String(r.passenger?._id || r.passenger) === String(userId)
        ) ? (
          <button
            className="px-4 py-1.5 text-xs font-medium rounded-full 
            bg-gradient-to-r from-green-500 to-emerald-600 
            text-white shadow"
            onClick={() => {
              const myReview = (b.ride.reviews || []).find(
                (r) =>
                  String(r.passenger?._id || r.passenger) === String(userId)
              );

              setRating(myReview.rating);
              setComment(myReview.comment);
              setAlreadyReviewed(true);
              setReviewRide(b);
            }}
          >
            Review Done ✔
          </button>
        ) : (
          <button
            onClick={() => {
              setAlreadyReviewed(false);
              setRating(5);
              setComment("");
              setReviewRide(b);
            }}
            className="px-4 py-1.5 text-xs font-medium rounded-full 
            bg-gradient-to-r from-yellow-400 to-yellow-500 
            text-white shadow hover:scale-105 transition"
          >
            ⭐ Review
          </button>
        )
      )}

    </div>

  </div>
</div>
// /--------------------------------------------------------
          ))
      )}
    </div>


{/* {reviewRide && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-lg font-bold mb-3">
              Rate Your Ride ⭐
            </h2> */}
            {reviewRide && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

    <div className="bg-white p-6 rounded-xl w-96 relative">

      {/* Close Button */}
      <button
        onClick={() => setReviewRide(null)}
        className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-red-500"
      >
        ✖
      </button>

      <h2 className="text-lg font-bold mb-3">
        Rate Your Ride ⭐
      </h2>
      {alreadyReviewed && (
  <p className="text-green-600 mb-3 font-semibold">
    You already reviewed this ride ✔
  </p>
)}

            <select
            //   className="border p-2 w-full mb-3"
            //   value={rating}
            //   onChange={(e) => setRating(e.target.value)}
            // >
  
  className="border p-2 w-full mb-3"
  value={rating}
  disabled={alreadyReviewed}
  onChange={(e) => setRating(e.target.value)}
>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>


            {/* <textarea
              className="border p-2 w-full mb-3"
              placeholder="Write feedback"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            /> */}
            <textarea
  className="border p-2 w-full mb-3"
  placeholder="Write feedback"
  value={comment}
  disabled={alreadyReviewed}
  onChange={(e) => setComment(e.target.value)}
/>


            {/* <button
              onClick={submitReview}
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
            >
              Submit Review
            </button> */}
            {!alreadyReviewed && (
  <button
    onClick={submitReview}
    className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
  >
    Submit Review
  </button>
)}

          </div>

        </div>

      )}

    </>
  );
}
