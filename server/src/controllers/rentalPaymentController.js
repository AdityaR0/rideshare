const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const RentalVehicle = require("../models/RentalVehicle");
const RentalBooking = require("../models/RentalBooking");

// Fixed booking token
const BOOKING_AMOUNT = 100;

/* =====================================================
   CREATE RENTAL STRIPE PAYMENT INTENT
===================================================== */

exports.createRentalStripeIntent = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
    } = req.body;

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details",
      });
    }

    // Find vehicle
    const vehicle = await RentalVehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Calculate rental days
    const rentalDays = Math.max(
      1,
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) /
          (1000 * 60 * 60 * 24)
      )
    );

    // Price Calculation
    const rentalCharge =
      rentalDays * vehicle.pricePerDay;

    const totalRentalValue =
      rentalCharge + vehicle.securityDeposit;

    const remainingAmount =
      totalRentalValue - BOOKING_AMOUNT;

    // Create Stripe Payment Intent
    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: BOOKING_AMOUNT * 100,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });

    return res.json({
      success: true,

      clientSecret:
        paymentIntent.client_secret,

      bookingAmount:
        BOOKING_AMOUNT,

      rentalDays,

      rentalCharge,

      totalRentalValue,

      remainingAmount,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Stripe Payment Error",
    });

  }
};

/* =====================================================
   CONFIRM RENTAL PAYMENT
===================================================== */

exports.confirmRentalPayment = async (req, res) => {

  try {

    const {
      vehicleId,
      paymentIntentId,
      startDate,
      endDate,
    } = req.body;

    if (
      !vehicleId ||
      !paymentIntentId ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing booking information",
      });
    }

    const vehicle =
      await RentalVehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const rentalDays = Math.max(
      1,
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) /
          (1000 * 60 * 60 * 24)
      )
    );

    const rentalCharge =
      rentalDays * vehicle.pricePerDay;

    const totalRentalValue =
      rentalCharge + vehicle.securityDeposit;

    const remainingAmount =
      totalRentalValue - BOOKING_AMOUNT;

    // Create Booking
    const booking =
      await RentalBooking.create({

        owner: vehicle.owner,

        passenger: req.user.id,

        vehicle: vehicle._id,

        startDate,

        endDate,

        totalDays: rentalDays,

        pricePerDay: vehicle.pricePerDay,

        totalRent: rentalCharge,

        bookingToken: BOOKING_AMOUNT,

        remainingAmount,

        paymentId: paymentIntentId,

      });

      vehicle.status = "BOOKED";

await vehicle.save();

    return res.json({
      success: true,
      booking,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Payment Confirmation Failed",
    });

  }

};