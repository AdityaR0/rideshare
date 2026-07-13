import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios";

import {
   MapPin,
  Phone,
  Fuel,
  Calendar,
  Gauge,
  Users,
  ShieldCheck,
  Star,
  Car,
} from "lucide-react";

export default function RentalVehicleDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const BOOKING_AMOUNT = 100;

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {

      const res = await api.get(`/rental-vehicles/${id}`);

      setVehicle(res.data.rentalVehicle);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

// =====================
// RENT CALCULATION
// =====================

const rentalDays =
  startDate && endDate
    ? Math.max(
        1,
        Math.ceil(
          (new Date(endDate) - new Date(startDate)) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

const rentalCharge =
  rentalDays * (vehicle?.pricePerDay || 0);

const totalRentalValue =
  rentalCharge + (vehicle?.securityDeposit || 0);

const remainingAmount =
  totalRentalValue - BOOKING_AMOUNT;

// ===============================
// CONTINUE TO PAYMENT
// ===============================
const handleContinue = async () => {

  // Check start date
  if (!startDate) {
    alert("Please select rental start date.");
    return;
  }

  // Check end date
  if (!endDate) {
    alert("Please select rental end date.");
    return;
  }

  // End date cannot be before start date
  if (rentalDays <= 0) {
    alert("Invalid rental dates.");
    return;
  }

  try {

    console.log("Sending to backend:");

console.log({
  vehicleId: vehicle._id,
  startDate,
  endDate,
});

    const res = await api.post(
      "/rental-payments/rental-stripe-intent",
      // {

      //   rentalVehicleId: vehicle._id,

      //   startDate,

      //   endDate,

      //   rentalCharge,

      //   securityDeposit: vehicle.securityDeposit,

      // }
      {

    vehicleId: vehicle._id,

    startDate,

    endDate,

}
    );

    if (res.data.success) {

  navigate("/rental-payment", {
    state: {
      vehicle,
      startDate,
      endDate,
      paymentData: res.data,
    },
  });

} else {

  alert("Unable to create payment.");

}

  } catch (err) {

    console.log(err);

    alert("Unable to create payment.");

  }

};
  

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">

        <div className="text-center">

          <div className="animate-spin h-14 w-14 rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>

          <p className="mt-5 text-slate-500">
            Loading vehicle...
          </p>

        </div>

      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex justify-center items-center">

        <h1 className="text-3xl font-bold">

          Vehicle Not Found

        </h1>

      </div>
    );
  }

  return (

    <div className="bg-slate-100 min-h-screen py-8">

      <div className="max-w-7xl mx-auto px-5">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">

            {vehicle.vehicleName}

          </h1>

          <div className="flex items-center gap-4 mt-3">

            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">

              {vehicle.status}

            </span>

          </div>

        </div>

        {/* Main */}

        <div className="grid lg:grid-cols-5 gap-8">

          {/* LEFT IMAGE */}

          <div className="lg:col-span-3">

            <div className="bg-white rounded-3xl overflow-hidden border shadow-sm">

              <img
                src={
                  vehicle.images?.length
                    ? vehicle.images[0]
                    : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
                }
                alt={vehicle.vehicleName}
                className="w-full h-[500px] object-cover"
              />

            </div>

{/* ================= OWNER CARD ================= */}

<div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mt-8">

  {/* Header */}

  <div className="flex items-center justify-between mb-6">

    <h3 className="text-xl font-bold text-slate-900">
      Vehicle Owner
    </h3>

    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
      Verified
    </span>

  </div>

  {/* Owner Info */}

  <div className="flex items-center gap-4">

    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">

      <span className="text-2xl font-bold text-indigo-600">
        {vehicle.owner?.name?.charAt(0).toUpperCase()}
      </span>

    </div>

    <div>

      <h4 className="text-lg font-bold text-slate-900">
        {vehicle.owner?.name}
      </h4>

      <p className="text-sm text-slate-500">
        RideShare Verified Owner
      </p>

    </div>

  </div>

  {/* Divider */}

  <div className="border-t border-slate-200 my-6"></div>

  {/* Contact */}

  <div className="grid gap-5">

    <div className="flex items-start gap-3">

      <Phone className="w-5 h-5 text-indigo-600 mt-1" />

      <div>

        <p className="text-xs uppercase tracking-wide text-slate-400">
          Contact Number
        </p>

        <p className="font-semibold text-slate-800">
          {vehicle.owner?.phone}
        </p>

      </div>

    </div>

    <div className="flex items-start gap-3">

      <MapPin className="w-5 h-5 text-indigo-600 mt-1" />

      <div>

        <p className="text-xs uppercase tracking-wide text-slate-400">
          Pickup Location
        </p>

        <p className="font-semibold text-slate-800 leading-6">
          {vehicle.pickupAddress}
        </p>

      </div>

    </div>

  </div>

</div>
                
</div>

          {/* RIGHT SIDE */}

          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl border shadow-sm p-6">

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-slate-500">

                    Rental Price

                  </p>

                  <h2 className="text-5xl font-bold text-indigo-600 mt-2">

                    ₹{vehicle.pricePerDay}

                  </h2>

                  <p className="text-slate-500">

                    Per Day

                  </p>

                </div>

                <ShieldCheck
                  className="text-green-600"
                  size={42}
                />

              </div>

              <hr className="my-6"/>

              <div className="grid grid-cols-2 gap-5">

                <div className="flex gap-3">

                  <Fuel className="text-indigo-600"/>

                  <div>

                    <p className="text-xs text-slate-500">

                      Fuel

                    </p>

                    <p className="font-semibold">

                      {vehicle.fuelType}

                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <Gauge className="text-indigo-600"/>

                  <div>

                    <p className="text-xs text-slate-500">

                      Gear

                    </p>

                    <p className="font-semibold">

                      {vehicle.transmission}

                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

  <Car className="text-indigo-600" />

  <div>

    <p className="text-xs text-slate-500">
      Vehicle No.
    </p>

    <p className="font-semibold">
      {vehicle.vehicleNumber}
    </p>

  </div>

</div>

                
              </div>

                            {/* ================= BOOKING CARD ================= */}

              <div className="mt-8 border-t pt-8">

                <h3 className="text-xl font-bold mb-5">
                  Booking Details
                </h3>

                <div className="space-y-5">

                  {/* Start Date */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Rental Start Date
                    </label>

                    <input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  className="w-full border rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-indigo-500"
/>

                  </div>

                  {/* End Date */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Rental End Date
                    </label>

                   <input
  type="date"
  value={endDate}
  onChange={(e) => setEndDate(e.target.value)}
  className="w-full border rounded-xl px-4 h-12 outline-none focus:ring-2 focus:ring-indigo-500"
/>

                  </div>

                </div>

                <hr className="my-7"/>

                <div className="space-y-3">

                  <div className="space-y-3">

  <div className="flex justify-between">

    <span className="text-slate-500">
      Rental Price
    </span>

    <span className="font-semibold">
      ₹{vehicle.pricePerDay}/day
    </span>

  </div>

  <div className="flex justify-between">

    <span className="text-slate-500">
      Rental Charge
    </span>

    <span className="font-semibold">
      ₹{rentalCharge}
    </span>

  </div>

  <div className="flex justify-between">

    <span className="text-slate-500">
      Security Deposit
    </span>

    <span className="font-semibold">
      ₹{vehicle.securityDeposit}
    </span>

  </div>

  <hr />

  <div className="flex justify-between">

    <span className="font-semibold">
      Pay Now
    </span>

    <span className="text-green-600 font-bold">
      ₹100
    </span>

  </div>

  <div className="flex justify-between">

    <span className="text-slate-500">
      Remaining
    </span>

    <span className="font-semibold">
      ₹{remainingAmount}
    </span>

  </div>

</div>

                </div>

                <button
onClick={handleContinue}
className="
w-full
mt-7
h-12
rounded-xl
bg-indigo-600
hover:bg-indigo-700
text-white
font-semibold
transition
"
>
Continue to Payment
</button>

              </div>
                            
                          </div>

            </div>

          </div>

        </div>

      </div>

    // </div>

  );

}