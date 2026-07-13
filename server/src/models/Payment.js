const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // method: {
    //   type: String,
    //   enum: ["UPI", "QR", "CASH"],
    //   required: true,
    // },
    // status: {
    //   type: String,
    //   enum: ["CONFIRMED"],
    //   default: "CONFIRMED",
    // },
    method: {
  type: String,
  enum: ["UPI", "QR", "CASH", "CARD"],
  required: true,
},

status: {
  type: String,
  enum: ["PENDING", "CONFIRMED", "FAILED", "PAID"],
  default: "PAID",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
