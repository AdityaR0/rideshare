import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Car,
} from "lucide-react";

import api from "../../utils/axios";

export default function DriverRentalBookingDetails() {

  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [enteredOTP, setEnteredOTP] = useState("");
const [verifying, setVerifying] = useState(false);

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

  const generatePickupOTP = async () => {

  try {

    const res = await api.put(
      `/rental-bookings/pickup-otp/${bookingId}`
    );

    alert(res.data.message);

    fetchBooking();

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.message ||
      "Failed to generate Pickup OTP"
    );

  }

};
const verifyPickupOTP = async () => {

  if (!enteredOTP) {

    alert("Enter Pickup OTP");

    return;

  }

  try {

    setVerifying(true);

    const res = await api.put(

      `/rental-bookings/verify-pickup/${bookingId}`,

      {
        otp: enteredOTP,
      }

    );

    alert(res.data.message);

    setEnteredOTP("");

    fetchBooking();

  } catch (err) {

    alert(

      err.response?.data?.message ||

      "OTP Verification Failed"

    );

  } finally {

    setVerifying(false);

  }

};
const generateReturnOTP = async () => {

  try {

    const res = await api.put(
      `/rental-bookings/return-otp/${bookingId}`
    );

    alert(res.data.message);

    fetchBooking();

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Failed to generate Return OTP"
    );

  }

};

const verifyReturnOTP = async () => {

  if (!enteredOTP) {

    alert("Enter Return OTP");

    return;

  }

  try {

    setVerifying(true);

    const res = await api.put(

      `/rental-bookings/verify-return/${bookingId}`,

      {
        otp: enteredOTP,
      }

    );

    alert(res.data.message);

    setEnteredOTP("");

    fetchBooking();

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Verification Failed"
    );

  } finally {

    setVerifying(false);

  }

};

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-2xl font-semibold">

          Loading Booking...

        </h2>

      </div>

    );

  }

  if (!booking) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-2xl font-semibold">

          Booking Not Found

        </h2>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 py-8">

      <div className="max-w-7xl mx-auto px-5">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-sm border p-6">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-3xl font-bold">

                Driver Rental Booking

              </h1>

              <p className="text-slate-500 mt-2">

                Booking ID :
                <span className="font-semibold">

                  {" "}
                  {booking._id}

                </span>

              </p>

            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                booking.bookingStatus === "BOOKED"
                  ? "bg-green-100 text-green-700"
                  : booking.bookingStatus === "ACTIVE"
                  ? "bg-yellow-100 text-yellow-700"
                  : booking.bookingStatus === "COMPLETED"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >

              {booking.bookingStatus}

            </span>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-3 gap-8 mt-8">

                {/* ================= LEFT ================= */}

        <div className="lg:col-span-2 space-y-8">

          {/* Vehicle Card */}

          <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

            <img
              src={
                booking.vehicle.images?.length
                  ? booking.vehicle.images[0]
                  : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
              }
              alt={booking.vehicle.vehicleName}
              className="w-full h-80 object-cover"
            />

            <div className="p-6">

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-3xl font-bold">

                    {booking.vehicle.vehicleName}

                  </h2>

                  <p className="text-slate-500 mt-2">

                    Vehicle Number :
                    <span className="font-semibold">

                      {" "}
                      {booking.vehicle.vehicleNumber}

                    </span>

                  </p>

                </div>

                <div className="text-right">

                  <h3 className="text-3xl font-bold text-indigo-600">

                    ₹{booking.pricePerDay}

                  </h3>

                  <p className="text-slate-500">

                    Per Day

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Passenger Details */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-6">

              Passenger Details

            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                  <User className="text-indigo-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500">

                    Passenger

                  </p>

                  <p className="font-semibold text-lg">

                    {booking.passenger.name}

                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">

                  <Phone className="text-green-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500">

                    Phone

                  </p>

                  <p className="font-semibold">

                    {booking.passenger.phone}

                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

                  <Mail className="text-blue-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500">

                    Email

                  </p>

                  <p className="font-semibold">

                    {booking.passenger.email}

                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">

                  <MapPin className="text-orange-600" />

                </div>

                <div>

                  <p className="text-sm text-slate-500">

                    Pickup Address

                  </p>

                  <p className="font-semibold">

                    {booking.vehicle.pickupAddress}

                  </p>

                </div>

              </div>

            </div>

            </div>

          </div>

                  {/* ================= RIGHT ================= */}

        <div className="space-y-8">

          {/* Rental Summary */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <Calendar className="text-indigo-600" />

              <h2 className="text-2xl font-bold">

                Rental Summary

              </h2>

            </div>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Pickup Date

                </span>

                <span className="font-semibold">

                  {new Date(
                    booking.startDate
                  ).toLocaleDateString()}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Return Date

                </span>

                <span className="font-semibold">

                  {new Date(
                    booking.endDate
                  ).toLocaleDateString()}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Rental Days

                </span>

                <span className="font-semibold">

                  {booking.totalDays} Days

                </span>

              </div>

            </div>

          </div>

          {/* Payment Summary */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <CreditCard className="text-green-600" />

              <h2 className="text-2xl font-bold">

                Payment Summary

              </h2>

            </div>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Rental Charge

                </span>

                <span className="font-semibold">

                  ₹{booking.totalRent}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Security Deposit

                </span>

                <span className="font-semibold">

                  ₹{booking.vehicle.securityDeposit}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Booking Token

                </span>

                <span className="font-semibold text-green-600">

                  ₹{booking.bookingToken}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Remaining Amount

                </span>

                <span className="font-bold text-red-600">

                  ₹{booking.remainingAmount}

                </span>

              </div>

              <hr />

              <div className="flex justify-between">

                <span className="font-semibold">

                  Payment Status

                </span>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">

                  {booking.paymentStatus}

                </span>

              </div>

            </div>

          </div>

          {/* Vehicle Info */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <Car className="text-indigo-600" />

              <h2 className="text-2xl font-bold">

                Vehicle Information

              </h2>

            </div>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Vehicle Number

                </span>

                <span className="font-semibold">

                  {booking.vehicle.vehicleNumber}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Fuel Type

                </span>

                <span className="font-semibold">

                  {booking.vehicle.fuelType}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-500">

                  Transmission

                </span>

                <span className="font-semibold">

                  {booking.vehicle.transmission}

                </span>

              </div>

            </div>

          </div>

          {/* ================= OTP VERIFICATION ================= */}

<div className="bg-white rounded-3xl border shadow-sm p-6">

  <h2 className="text-2xl font-bold mb-5">

    {booking.bookingStatus === "BOOKED"

      ? "Pickup Verification"

      : booking.bookingStatus === "ACTIVE"

      ? "Return Verification"

      : "Verification"}

  </h2>

  {/* BOOKED */}

  {booking.bookingStatus === "BOOKED" && (

    <>

      {!booking.pickupOTP ? (

        <button

          onClick={generatePickupOTP}

          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"

        >

          Generate Pickup OTP

        </button>

      ) : (

        <>

          <input

            type="text"

            value={enteredOTP}

            onChange={(e) =>

              setEnteredOTP(e.target.value)

            }

            placeholder="Enter Pickup OTP"

            className="w-full border rounded-xl p-3"

          />

          <button

            onClick={verifyPickupOTP}

            disabled={verifying}

            className="w-full mt-4 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold"

          >

            {verifying

              ? "Verifying..."

              : "Verify Pickup OTP"}

          </button>

        </>

      )}

    </>

  )}

  {/* ACTIVE */}

  {booking.bookingStatus === "ACTIVE" && (

    <div className="text-center">

      <div className="text-green-600 text-5xl">

        ✅

      </div>

      <h3 className="mt-3 text-xl font-bold">

        Pickup Verified

      </h3>

      <p className="text-slate-500 mt-2">

        Rental has started successfully.

      </p>

    </div>

  )}

  {/* COMPLETED */}

  {booking.bookingStatus === "COMPLETED" && (

    <div className="text-center">

      <div className="text-green-600 text-5xl">

        🎉

      </div>

      <h3 className="mt-3 text-xl font-bold">

        Rental Completed

      </h3>

    </div>

  )}

</div>

          {/* ================= RETURN OTP ================= */}
{booking.bookingStatus === "ACTIVE" && (

<div className="bg-white rounded-3xl border shadow-sm p-6">

<h2 className="text-2xl font-bold mb-5">

Return Verification

</h2>

{!booking.returnOTP ? (

<button

onClick={generateReturnOTP}

className="w-full h-12 rounded-xl bg-green-600 text-white"

>

Generate Return OTP

</button>

) : (

<>

<input

type="text"

value={enteredOTP}

onChange={(e)=>setEnteredOTP(e.target.value)}

placeholder="Enter Return OTP"

className="w-full border rounded-xl p-3"

/>

<button

onClick={verifyReturnOTP}

disabled={verifying}

className="w-full mt-4 h-12 rounded-xl bg-indigo-600 text-white"

>

{verifying

? "Verifying..."

: "Verify Return OTP"}

</button>

</>

)}

</div>

)}

          {/* ================= ACTIONS ================= */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <h2 className="text-2xl font-bold mb-5">

              Booking Actions

            </h2>

            <div className="space-y-4">

              <button
                className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Cancel Booking
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

</div> 

  );

}