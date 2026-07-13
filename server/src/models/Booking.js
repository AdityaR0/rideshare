// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     ride: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ride",
//       required: true,
//     },
//     passenger: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     driver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["confirmed", "completed", "cancelled"],
//       default: "confirmed",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["paid"],
//       default: "paid",
//     },
//     paymentId: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // NEW: number of seats booked
    seatsBooked: {
      type: Number,
      required: true,
      default: 1,
    },

    // NEW: passenger list
    passengers: [
      {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
        },
      },
    ],

    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled"],
      default: "confirmed",
    },
    
    cancelReason: {
  type: String,
  default: ""
},

    paymentStatus: {
      type: String,
      enum: ["paid"],
      default: "paid",
    },

    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
