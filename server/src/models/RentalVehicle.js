const mongoose = require("mongoose");

const rentalVehicleSchema = new mongoose.Schema(
  {
    // Vehicle Owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Vehicle Type
    vehicleType: {
      type: String,
      enum: ["Bike", "Car", "Scooter", "Cycle"],
      required: true,
    },

    // Vehicle Name
    vehicleName: {
      type: String,
      required: true,
      trim: true,
    },

    // Vehicle Registration Number
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // Fuel Type
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "CNG"],
      required: true,
    },

    // Transmission
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual",
    },

    // Rental Price
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    // Refundable Security Deposit
    securityDeposit: {
      type: Number,
      default: 0,
    },

    // Pickup Location
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },

    // Description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Vehicle Images
    images: [
      {
        type: String,
      },
    ],

    // Vehicle Availability
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "UNAVAILABLE"],
      default: "AVAILABLE",
    },

    // Statistics
    averageRating: {
      type: Number,
      default: 0,
    },

    totalRentals: {
      type: Number,
      default: 0,
    },

    // Hide / Show Listing
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RentalVehicle", rentalVehicleSchema);