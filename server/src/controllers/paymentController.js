const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const User = require("../models/User");

const CoinTransaction = require("../models/CoinTransaction");


const {
  calculateRideCoinDiscount,
} = require("../services/rideCoinService");

/* ================= CREATE STRIPE PAYMENT INTENT ================= */
exports.createStripeIntent = async (req, res) => {
  try {
    // const { rideId } = req.body;
    const { rideId, seats = 1 } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "Ride ID required" });
    }

    const ride = await Ride.findById(rideId);
    const user = await User.findById(req.user.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const rideFare = ride.pricePerSeat * seats;
    const discountInfo = calculateRideCoinDiscount({
  rideFare,
  availableCoins: user.rideCoins,
  isPremium: user.isPremium,
});
    const paymentIntent = await stripe.paymentIntents.create({
      // amount: ride.pricePerSeat * 100, 
      // amount: ride.pricePerSeat * seats * 100,
      amount: discountInfo.payableAmount * 100,
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,

      rideFare: discountInfo.rideFare,
  rideCoinDiscount: discountInfo.coinsUsed,
  payableAmount: discountInfo.payableAmount,
    });
  } catch (error) {
    console.error("Stripe intent error:", error);
    res.status(500).json({ message: "Stripe intent failed" });
  }
};

/* ================= CONFIRM STRIPE PAYMENT ================= */
exports.confirmStripePayment = async (req, res) => {
  try {
    // const { rideId, paymentIntentId } = req.body;
    const {
  rideId,
  paymentIntentId,
  seats = 1,
  passengers = [],
  useRideCoins = true,
} = req.body;

console.log("========= PAYMENT HIT =========");
console.log("Ride:", rideId);
console.log("Seats:", seats);

    if (!rideId || !paymentIntentId) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    const ride = await Ride.findById(rideId);
    const user = await User.findById(req.user.id);
    const rideFare = ride.pricePerSeat * seats;

const discountInfo = calculateRideCoinDiscount({
    rideFare,
    availableCoins: user.rideCoins,
    isPremium: user.isPremium,
});
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
    // const booking = await Booking.create({
    //   ride: ride._id,
    //   passenger: req.user.id,
    //   driver: ride.driver,
    //   status: "confirmed",
    // });
    const booking = await Booking.create({
  ride: ride._id,
  passenger: req.user.id,
  driver: ride.driver,

  seatsBooked: seats,

  passengers: passengers,

  status: "confirmed",
});

    // Save payment (NO card details stored)
    // await Payment.create({
    //   booking: booking._id,
    //   amount: ride.pricePerSeat,
    //   method: "CARD",
    //   paymentId: paymentIntentId,
    //   status: "paid",
    // });
    await Payment.create({
  booking: booking._id,
  amount: ride.pricePerSeat * seats,
  method: "CARD",
  paymentId: paymentIntentId,
  status: "PAID",
});
// ================================
// REDEEM RIDECOINS
// ================================

if (useRideCoins && discountInfo.coinsUsed > 0) {

  // Deduct RideCoins
  user.rideCoins -= discountInfo.coinsUsed;

  // Update redeemed statistics
  user.totalRideCoinsRedeemed += discountInfo.coinsUsed;

  // Save updated user
  await user.save();

  // Save transaction
  await CoinTransaction.create({
    user: user._id,
    coins: discountInfo.coinsUsed,
    transactionType: "debit",
    reason: "RideCoins Redeemed",
  });

  console.log(
    `✅ ${discountInfo.coinsUsed} RideCoins redeemed by ${user.name}`
  );
}

    // Update ride
    ride.passengers.push(req.user.id);
    // ride.seatsAvailable -= 1;
    ride.seatsAvailable -= seats;
    // if (ride.seatsAvailable === 0) ride.status = "BOOKED";
    if (ride.seatsAvailable < 0) {
  ride.seatsAvailable = 0;
}


    await ride.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Stripe confirm error:", error);
    res.status(500).json({ message: "Payment confirmation failed" });
  }
};
