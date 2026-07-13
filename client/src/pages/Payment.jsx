import { useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";
import api from "../utils/axios";
// import { useState } from "react";
import { useState, useEffect } from "react";

/* ================= CHECKOUT FORM ================= */

// function CheckoutForm({ ride }) {
// function CheckoutForm({ ride, seats, passengers }) {
function CheckoutForm({
  ride,
  seats,
  passengers,
  paymentSummary,
  useRideCoins,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const finalAmount = useRideCoins
  ? paymentSummary.payableAmount
  : paymentSummary.rideFare;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || loading) return;

    setLoading(true);

    try {
      // 1️⃣ Create payment intent
      // const intentRes = await api.post("/payments/stripe-intent", {
      //   rideId: ride._id,
      // });
      // const intentRes = await api.post("/payments/stripe-intent", {
      // rideId: ride._id,
      // seats,
      // });
      const intentRes = await api.post("/payments/stripe-intent", {
    rideId: ride._id,
    seats,
    useRideCoins,
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
      // const confirmRes = await api.post("/payments/stripe-confirm", {
      //   rideId: ride._id,
      //   paymentIntentId: result.paymentIntent.id,
      // });
      // ✅ Validate passengers
const validPassengers = (passengers || []).filter(
  (p) => p && p.name && p.phone
);

if (validPassengers.length !== seats) {
  alert("❌ Please fill all passenger details");
  setLoading(false);
  return;
}
      // const confirmRes = await api.post("/payments/stripe-confirm", {
      // rideId: ride._id,
      // paymentIntentId: result.paymentIntent.id,
      // seats,
      // passengers
      // });
//       const confirmRes = await api.post("/payments/stripe-confirm", {
//   rideId: ride._id,
//   paymentIntentId: result.paymentIntent.id,
//   seats,
//   passengers: validPassengers   // ✅ FIXED
// });
const confirmRes = await api.post("/payments/stripe-confirm", {
    rideId: ride._id,
    paymentIntentId: result.paymentIntent.id,
    seats,
    passengers: validPassengers,
    useRideCoins,
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
    // <form onSubmit={handlePayment} className="border rounded-xl p-4 space-y-4">
    <form
  onSubmit={handlePayment}
  className="bg-white rounded-2xl shadow-lg p-6 space-y-5"
>
      <h3 className="font-semibold">Secure Card Payment</h3>
      <div className="text-sm text-green-600">
  🔒 SSL Secured Payment
</div>

      {/* <CardElement className="p-3 border rounded" /> */}
      <div className="border rounded-xl p-4">
  <CardElement />
</div>

      {/* <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading
            ? "bg-slate-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        
        {loading ? "Processing..." : `Pay ₹${ride.pricePerSeat * seats}`}
      </button> */}
      <button
  type="submit"
  disabled={
    loading ||
    (passengers?.filter(p => p?.name && p?.phone).length !== seats)
  }
  className={`w-full py-2 rounded text-white ${
    loading ||
    (passengers?.filter(p => p?.name && p?.phone).length !== seats)
      ? "bg-slate-400 cursor-not-allowed"
      // : "bg-indigo-600 hover:bg-indigo-700"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {loading
    ? "Processing..."
    : passengers?.filter(p => p?.name && p?.phone).length !== seats
    ? "Fill passenger details"
    // : `Pay ₹${ride.pricePerSeat * seats}`}
    : `Pay ₹${finalAmount}`}
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

  // const { ride } = state;
  // const { ride, seats, passengers } = state;
  const { ride, seats = 1, passengers = [] } = state;

  const [paymentSummary, setPaymentSummary] = useState({
  rideFare: ride.pricePerSeat * seats,
  rideCoinDiscount: 0,
  payableAmount: ride.pricePerSeat * seats,
});
const [useRideCoins, setUseRideCoins] = useState(true);

const displayDiscount = useRideCoins
  ? paymentSummary.rideCoinDiscount
  : 0;

const displayPayable = useRideCoins
  ? paymentSummary.payableAmount
  : paymentSummary.rideFare;

useEffect(() => {

  const loadPaymentSummary = async () => {

    try {

      const res = await api.post("/payments/stripe-intent", {
        rideId: ride._id,
        seats,
      });

      setPaymentSummary({
        rideFare: res.data.rideFare,
        rideCoinDiscount: res.data.rideCoinDiscount,
        payableAmount: res.data.payableAmount,
      });

    } catch (err) {
      console.error(err);
    }

  };

  loadPaymentSummary();

}, [ride._id, seats]);


  return (
    // <div className="max-w-xl mx-auto p-6">
    <div className="max-w-6xl mx-auto p-6">
       <button
      onClick={() => navigate(-1)}
      className="
        mb-4
        px-4 py-2
        bg-gray-100
        hover:bg-gray-200
        rounded-lg
        text-sm
        font-medium
      "
    >
      ← Back to Ride Details
    </button>
      <h2 className="text-2xl font-bold mb-4">Stripe Payment</h2>

      {/* <div className="mb-4 text-sm space-y-1">
        <p>
          <b>Route:</b> {ride.origin} → {ride.destination}
        </p>
        <p>
          <b>Total:</b> ₹{ride.pricePerSeat}
        </p>
      </div> */}
      {/* <div className="mb-4 text-sm space-y-2">

  <p>
    <b>Route:</b> {ride.origin} → {ride.destination}
  </p>

  <p>
    <b>Seats:</b> {seats}
  </p>

  <p>
    <b>Total:</b> ₹{ride.pricePerSeat * seats}
  </p>

  <div className="mt-2">
    <b>Passengers:</b>
    <ul className="list-disc ml-6">
      {passengers?.map((p, i) => (
        <li key={i}>
          {p.name} ({p.phone})
        </li>
      ))}
    </ul>
  </div>

</div> */}

      <div className="grid md:grid-cols-2 gap-6">

  {/* LEFT SIDE */}
  <div>

    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h3 className="text-2xl font-bold mb-6">
  🚗 Booking Summary
</h3>

<div className="space-y-4">

  <div>
    <p className="text-gray-500 text-sm">Route</p>
    <p className="font-semibold">
      {ride.origin} → {ride.destination}
    </p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">Date & Time</p>
    <p className="font-semibold">
      {new Date(ride.date).toLocaleString()}
    </p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">Vehicle Number</p>
    <p className="font-semibold">
      {ride.vehicleNumber}
    </p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">Seats Booked</p>
    <p className="font-semibold">
      {seats}
    </p>
  </div>

</div>

      <hr className="my-5" />

<h4 className="font-semibold text-lg mb-4">
  💰 Payment Summary
</h4>

<div className="space-y-4">

  <div className="flex justify-between">
    <span className="text-gray-600">
      Ride Fare
    </span>

    {/* <span className="font-semibold">
      ₹{ride.pricePerSeat * seats}
    </span> */}
    <span className="font-semibold">
  ₹{paymentSummary.rideFare}
</span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-600">
      RideCoins Discount
    </span>

    {/* <span className="font-semibold text-green-600">
      ₹0
    </span> */}
    <span className="font-semibold text-green-600">
  {/* -₹{paymentSummary.rideCoinDiscount} */}
  -₹{displayDiscount}
</span>
  </div>

  <div className="flex items-center gap-2">

    <input
    type="checkbox"
    checked={useRideCoins}
    onChange={() => setUseRideCoins(!useRideCoins)}
/>

    <span className="text-sm text-gray-500">
      Use RideCoins
    </span>

  </div>

</div>

      <hr className="my-5" />

<div className="flex justify-between items-center">

  {/* <span className="text-lg font-semibold">
    Total Amount
  </span>

  <span className="text-2xl font-bold text-green-600">
    ₹{ride.pricePerSeat * seats}
  </span> */}
  <span className="text-lg font-semibold">
  Total Payable
</span>

<span className="text-2xl font-bold text-green-600">
  {/* ₹{paymentSummary.payableAmount} */}
  ₹{displayPayable}
</span>

</div>

    </div>

  </div>

  {/* RIGHT SIDE */}
  <div>

    {/* <Elements stripe={stripePromise}>
      <CheckoutForm
        ride={ride}
        seats={seats}
        passengers={passengers}
      />
    </Elements> */}
    <div className="bg-white rounded-2xl shadow-lg p-6">

  <h3 className="font-bold text-xl mb-4">
    Payment Methods
  </h3>

  <div className="space-y-3">

    <div className="border rounded-lg p-3 bg-green-50 border-green-500">
      💳 Card Payment
      <span className="ml-2 text-green-600 text-sm">
        Available
      </span>
    </div>

    <button
      onClick={() =>
        alert("Cash payment is currently unavailable for this ride")
      }
      className="w-full text-left border rounded-lg p-3"
    >
      💵 Cash Payment
    </button>

    <button
      onClick={() =>
        alert("UPI payment coming soon")
      }
      className="w-full text-left border rounded-lg p-3"
    >
      📱 UPI
    </button>

    <button
      onClick={() =>
        alert("Wallet payment coming soon")
      }
      className="w-full text-left border rounded-lg p-3"
    >
      👛 Wallet
    </button>

  </div>

  <div className="mt-6">
    <Elements stripe={stripePromise}>
      {/* <CheckoutForm
        ride={ride}
        seats={seats}
        passengers={passengers}
      /> */}
      <CheckoutForm
    ride={ride}
    seats={seats}
    passengers={passengers}
    paymentSummary={paymentSummary}
    useRideCoins={useRideCoins}
/>
    </Elements>
  </div>

</div>

  </div>

</div>
    </div>
  );
}
