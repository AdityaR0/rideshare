const mongoose = require("mongoose");

const coinTransactionSchema = new mongoose.Schema(
  {
    // User who owns these coins
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Number of RideCoins
    coins: {
      type: Number,
      required: true,
    },

    // Credit / Debit / Expired
    transactionType: {
      type: String,
      enum: ["credit", "debit", "expired"],
      required: true,
    },

    // Why coins were added or removed
    reason: {
      type: String,
      required: true,
    },

    // Coin expiry (90 days from earning)
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CoinTransaction",
  coinTransactionSchema
);