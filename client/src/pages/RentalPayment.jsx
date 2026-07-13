import { useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";
import api from "../utils/axios";

import { useState } from "react";

/* ==========================================
            CHECKOUT FORM
========================================== */

function CheckoutForm({
  vehicle,
  startDate,
  endDate,
  paymentData,
}) {

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {

    e.preventDefault();

    if (!stripe || !elements || loading) return;

    setLoading(true);

    try {

      // ==========================
      // Create Payment Intent
      // ==========================

      const intentRes = await api.post(
        "/rental-payments/rental-stripe-intent",
        {

          vehicleId: vehicle._id,

          startDate,

          endDate,

        }
      );

      const clientSecret =
        intentRes.data.clientSecret;

      // ==========================
      // Confirm Card Payment
      // ==========================

      const result =
        await stripe.confirmCardPayment(
          clientSecret,
          {

            payment_method: {

              card: elements.getElement(CardElement),

            },

          }
        );

      if (result.error) {

        alert(result.error.message);

        setLoading(false);

        return;

      }

      // ==========================
      // Confirm Booking
      // ==========================

      const confirmRes = await api.post(
        "/rental-payments/rental-stripe-confirm",
        {

          vehicleId: vehicle._id,

          paymentIntentId:
            result.paymentIntent.id,

          startDate,

          endDate,

        }
      );
            if (confirmRes.data.success) {

        alert("Rental booked successfully.");

        navigate("/passenger/my-rentals");

      } else {

        alert("Booking failed.");

      }

    } catch (err) {

      console.error(err);

      alert("Payment failed.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* ================= LEFT ================= */}

        <div className="bg-white rounded-3xl shadow-sm border p-8">

          <img
            src={
              vehicle.images?.length > 0
                ? vehicle.images[0]
                : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200"
            }
            alt={vehicle.vehicleName}
            className="w-full h-72 rounded-2xl object-cover"
          />

          <h2 className="text-3xl font-bold mt-6">

            {vehicle.vehicleName}

          </h2>

          <p className="text-slate-500 mt-2">

            {vehicle.pickupAddress}

          </p>

          <div className="grid grid-cols-2 gap-5 mt-8">

            <div>

              <p className="text-sm text-slate-500">

                Start Date

              </p>

              <p className="font-semibold">

                {startDate}

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                End Date

              </p>

              <p className="font-semibold">

                {endDate}

              </p>

            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="bg-white rounded-3xl shadow-sm border p-8">

          <h2 className="text-2xl font-bold">

            Payment Summary

          </h2>

          <div className="space-y-4 mt-8">

            <div className="flex justify-between">

              <span className="text-slate-500">

                Rental Charge

              </span>

              <span className="font-semibold">

                ₹{paymentData.rentalCharge}

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

              <span className="font-bold text-green-600">

                ₹100

              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-slate-500">

                Remaining at Pickup

              </span>

              <span className="font-semibold">

                ₹{paymentData.remainingAmount}

              </span>

            </div>

          </div>

          <form
            onSubmit={handlePayment}
            className="mt-8"
          >

            <div className="border rounded-xl p-4">

              <CardElement />

            </div>

            <button
              type="submit"
              disabled={!stripe || loading}
              className="
                w-full
                mt-6
                h-12
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-700
                disabled:bg-slate-400
                text-white
                font-semibold
                transition
              "
            >
              {loading ? "Processing..." : "Pay ₹100"}
            </button>

          </form>

          <p className="text-xs text-slate-500 mt-5 leading-6">

            You are paying only the booking amount of
            <span className="font-semibold"> ₹100 </span>
            to confirm your rental.

            The remaining amount of
            <span className="font-semibold">
              {" "}₹{paymentData.remainingAmount}
            </span>
            will be paid directly to the vehicle owner at pickup.

          </p>

        </div>

      </div>

    </div>

  );

}
/* ==========================================
            RENTAL PAYMENT PAGE
========================================== */

export default function RentalPayment() {

  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {

    navigate("/passenger/rent-vehicles");

    return null;

  }

  const {

    vehicle,

    startDate,

    endDate,

    paymentData,

  } = location.state;

  return (

    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: paymentData.clientSecret,
      }}
    >

      <CheckoutForm
        vehicle={vehicle}
        startDate={startDate}
        endDate={endDate}
        paymentData={paymentData}
      />

    </Elements>

  );

}
