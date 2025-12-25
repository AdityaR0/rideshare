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

/* ================= CHECKOUT FORM ================= */

function CheckoutForm({ ride }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || loading) return;

    setLoading(true);

    try {
      // 1️⃣ Create payment intent
      const intentRes = await api.post("/payments/stripe-intent", {
        rideId: ride._id,
      });

      const clientSecret = intentRes.data.clientSecret;

      // 2️⃣ Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
        return;
      }

      // 3️⃣ Confirm booking in backend
      const confirmRes = await api.post("/payments/stripe-confirm", {
        rideId: ride._id,
        paymentIntentId: result.paymentIntent.id,
      });

      // ✅ EVEN IF API CALLED TWICE — SUCCESS
      if (confirmRes.data.success) {
        alert("✅ Payment successful & ride booked!");
        navigate("/passenger/my-rides");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);

      if (err.response?.data?.alreadyProcessed) {
        alert("✅ Payment already completed");
        navigate("/passenger/my-rides");
      } else {
        alert("❌ Payment failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold">Pay with Card (Stripe Demo)</h3>

      <CardElement className="p-3 border rounded" />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Processing..." : `Pay ₹${ride.pricePerSeat}`}
      </button>
    </form>
  );
}

/* ================= MAIN PAYMENT PAGE ================= */

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Safety check
  if (!state || !state.ride) {
    alert("❌ Invalid access. Please book a ride again.");
    navigate("/");
    return null;
  }

  const { ride } = state;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Stripe Payment</h2>

      <div className="mb-4 text-sm space-y-1">
        <p>
          <b>Route:</b> {ride.origin} → {ride.destination}
        </p>
        <p>
          <b>Total:</b> ₹{ride.pricePerSeat}
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm ride={ride} />
      </Elements>
    </div>
  );
}
