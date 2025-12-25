const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

/* ================= CREATE STRIPE PAYMENT INTENT ================= */
exports.createStripeIntent = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "Ride ID required" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: ride.pricePerSeat * 100, // INR -> paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe intent error:", error);
    res.status(500).json({ message: "Stripe intent failed" });
  }
};

/* ================= CONFIRM STRIPE PAYMENT ================= */
exports.confirmStripePayment = async (req, res) => {
  try {
    const { rideId, paymentIntentId } = req.body;

    if (!rideId || !paymentIntentId) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // ✅ IMPORTANT: Idempotent check (NO ERROR if already booked)
    const existingBooking = await Booking.findOne({
      ride: rideId,
      passenger: req.user.id,
    });

    if (existingBooking) {
      return res.json({
        success: true,
        alreadyProcessed: true,
        message: "Payment already confirmed",
      });
    }

    // Create booking
    const booking = await Booking.create({
      ride: ride._id,
      passenger: req.user.id,
      driver: ride.driver,
      status: "confirmed",
    });

    // Save payment (NO card details stored)
    await Payment.create({
      booking: booking._id,
      amount: ride.pricePerSeat,
      method: "CARD",
      paymentId: paymentIntentId,
      status: "paid",
    });

    // Update ride
    ride.passengers.push(req.user.id);
    ride.seatsAvailable -= 1;
    if (ride.seatsAvailable === 0) ride.status = "BOOKED";
    await ride.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Stripe confirm error:", error);
    res.status(500).json({ message: "Payment confirmation failed" });
  }
};
