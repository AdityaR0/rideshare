import { useEffect, useState } from "react";

// import { useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../utils/axios";

export default function RentalBookingDetails() {

  const { bookingId } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showCancelPopup, setShowCancelPopup] = useState(false);

const [cancelReason, setCancelReason] = useState(
  "My plans changed"
);

  useEffect(() => {

    fetchBooking();

  }, []);

  const fetchBooking = async () => {

    try {

      const res = await api.get(

        `/rental-bookings/${bookingId}`

      );

      setBooking(res.data.booking);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleCancelBooking = async () => {

  try {

    const res = await api.put(

      `/rental-bookings/cancel/${bookingId}`,

      {

        reason: cancelReason,

      }

    );

    // alert(res.data.message);

    // setShowCancelPopup(false);

    // fetchBooking();
    setShowCancelPopup(false);

alert("Booking cancelled successfully.");

navigate("/passenger/my-rentals");

  } catch (err) {

    alert(

      err.response?.data?.message ||

      "Failed to cancel booking"

    );

  }

};

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        Loading...

      </div>

    );

  }

  if (!booking) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        Booking Not Found

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-6xl mx-auto">

{/* -------------------------------------------------------------------------------------- */}
<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

  {/* Header */}

  <div className="border-b p-8">

    <button
      onClick={() => navigate(-1)}
      className="text-sm text-slate-500 hover:text-indigo-600"
    >
      ← Back
    </button>

    <div className="flex justify-between items-start mt-5">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Rental Booking Details
        </h1>

        <p className="text-slate-500 mt-2">
          Booking ID :
          <span className="font-semibold ml-2">
            {booking.rentalId || booking._id.slice(-8).toUpperCase()}
          </span>
        </p>

      </div>

      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold
        ${
          booking.bookingStatus === "BOOKED"
            ? "bg-blue-100 text-blue-700"
            : booking.bookingStatus === "ACTIVE"
            ? "bg-yellow-100 text-yellow-700"
            : booking.bookingStatus === "COMPLETED"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {booking.bookingStatus}
      </span>

    </div>

  </div>

  {/* Body */}

  <div className="grid lg:grid-cols-3 gap-8 p-8">

    {/* LEFT */}

    <div className="lg:col-span-2 space-y-6">

      {/* Vehicle */}

      <div className="border rounded-2xl overflow-hidden">

        <img
          src={
            booking.vehicle.images?.length
              ? booking.vehicle.images[0]
              : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
          }
          alt={booking.vehicle.vehicleName}
          className="w-full h-72 object-cover"
        />

        <div className="p-6">

          <h2 className="text-2xl font-bold">
            {booking.vehicle.vehicleName}
          </h2>

          <p className="text-slate-500 mt-2">
            {booking.vehicle.vehicleNumber}
          </p>

        </div>

      </div>

      {/* Owner */}

      <div className="border rounded-2xl p-6">

        <h3 className="font-semibold text-lg mb-5">
          Vehicle Owner
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <p className="text-slate-500 text-sm">
              Owner Name
            </p>

            <p className="font-semibold">
              {booking.owner.name}
            </p>

          </div>

          <div>

            <p className="text-slate-500 text-sm">
              Phone
            </p>

            <p className="font-semibold">
              {booking.owner.phone}
            </p>

          </div>

          <div className="md:col-span-2">

            <p className="text-slate-500 text-sm">
              Pickup Address
            </p>

            <p className="font-semibold">
              {booking.vehicle.pickupAddress}
            </p>

          </div>

        </div>

      </div>

    </div>

    {/* RIGHT */}

    <div className="space-y-6">

      {/* Payment */}

      <div className="border rounded-2xl p-6">

        <h3 className="font-semibold text-lg mb-5">
          Payment Summary
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>Rental Charge</span>
            <strong>₹{booking.totalRent}</strong>
          </div>

          <div className="flex justify-between">
            <span>Booking Token</span>
            <strong>₹{booking.bookingToken}</strong>
          </div>

          <div className="flex justify-between">
            <span>Remaining</span>
            <strong>₹{booking.remainingAmount}</strong>
          </div>

        </div>

      </div>

      {/* Booking */}

      <div className="border rounded-2xl p-6">

        <h3 className="font-semibold text-lg mb-5">
          Booking Information
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between">

            <span>Start Date</span>

            <strong>
              {new Date(
                booking.startDate
              ).toLocaleDateString()}
            </strong>

          </div>

          <div className="flex justify-between">

            <span>End Date</span>

            <strong>
              {new Date(
                booking.endDate
              ).toLocaleDateString()}
            </strong>

          </div>

        </div>

      </div>

      {/* Information */}

      <div className="border rounded-2xl p-6">

        <h3 className="font-semibold text-lg mb-4">
          Important Information
        </h3>

        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">

          <li>Carry your original driving licence.</li>

          <li>Reach 15 minutes before pickup.</li>

          <li>Vehicle inspection is mandatory.</li>

          <li>Security deposit will be refunded after inspection.</li>

        </ul>

      </div>

      {booking.bookingStatus === "BOOKED" && (

        <button

          onClick={() => setShowCancelPopup(true)}

          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"

        >

          Cancel Booking

        </button>

      )}

    </div>

  </div>

</div>
{/* -------------------------------------------------------------------------------------- */}

        {showCancelPopup && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl w-full max-w-lg p-7">

        <h2 className="text-2xl font-bold">

            Cancel Rental Booking

        </h2>

        <p className="text-slate-500 mt-2">

            Please tell us why you are cancelling this booking.

        </p>

        <div className="mt-6 space-y-3">

            {[
                "My plans changed",
                "Found cheaper vehicle",
                "Booked by mistake",
                "Pickup location is too far",
                "Other"
            ].map((reason) => (

                <label
                    key={reason}
                    className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-slate-50"
                >

                    <input
                        type="radio"
                        checked={cancelReason === reason}
                        onChange={() => setCancelReason(reason)}
                    />

                    {reason}

                </label>

            ))}

        </div>

        <div className="bg-slate-100 rounded-xl p-4 mt-6">

            <h3 className="font-semibold">

                Refund Summary

            </h3>

            <div className="flex justify-between mt-3">

                <span>Booking Amount</span>

                <span>₹100</span>

            </div>

            <div className="flex justify-between">

                <span>Cancellation Charge</span>

                <span>₹0</span>

            </div>

            <hr className="my-3"/>

            <div className="flex justify-between font-bold text-green-600">

                <span>Refund</span>

                <span>₹100</span>

            </div>

            <p className="text-xs text-slate-500 mt-3">

                Refund will be processed to your original payment method.

            </p>

        </div>

        <div className="flex justify-end gap-3 mt-7">

            <button

                onClick={() => setShowCancelPopup(false)}

                className="px-5 py-2 border rounded-xl"

            >

                Keep Booking

            </button>

            <button

                onClick={handleCancelBooking}

                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl"

            >

                Cancel Booking

            </button>

        </div>

    </div>

</div>

)}

      </div>

    </div>

  );

}