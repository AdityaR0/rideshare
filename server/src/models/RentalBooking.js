const mongoose = require("mongoose");

const rentalBookingSchema = new mongoose.Schema(
  {
    // Vehicle Owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Passenger who booked
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Rental Vehicle
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalVehicle",
      required: true,
    },

    // Rental ID (Professional)
    rentalId: {
      type: String,
      default: "",
    },

    // Rental Dates
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Total Rental Days
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    // Vehicle rent at booking time
    pricePerDay: {
      type: Number,
      required: true,
    },

    // Total Rent
    totalRent: {
      type: Number,
      required: true,
    },

    // Online Booking Token
    bookingToken: {
      type: Number,
      default: 100,
    },

    // Remaining amount to pay offline
    remainingAmount: {
      type: Number,
      required: true,
    },

    // Stripe Payment Intent
    paymentId: {
      type: String,
      default: "",
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: [
        "TOKEN_PAID",
        "REFUND_INITIATED",
        "REFUNDED",
      ],
      default: "TOKEN_PAID",
    },

    // Rental Status
    bookingStatus: {
      type: String,
      enum: [
        "BOOKED",
        "ACTIVE",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "BOOKED",
    },

    // Pickup OTP
    pickupOTP: {
      type: String,
      default: "",
    },

    // Return OTP
    returnOTP: {
      type: String,
      default: "",
    },

    // Pickup Verification
    pickupVerified: {
      type: Boolean,
      default: false,
    },

    // Return Verification
    returnVerified: {
      type: Boolean,
      default: false,
    },

    // Cancellation
    cancelReason: {
      type: String,
      default: "",
    },

    // Refund Status
    refundStatus: {
      type: String,
      enum: [
        "NONE",
        "INITIATED",
        "COMPLETED",
      ],
      default: "NONE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RentalBooking",
  rentalBookingSchema
);